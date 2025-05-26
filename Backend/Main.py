import os
import sqlite3
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from fastapi import Header
import uuid
from fastapi import FastAPI, HTTPException, Response, Cookie, Depends
import uuid
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

# Use absolute path to avoid DB path confusion
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATABASE = os.path.join(BASE_DIR, "Database.db")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],            # or ["*"] to allow all (not safe for production)
    allow_credentials=True,
    allow_methods=["*"],              # or specify ["GET", "POST", etc."]
    allow_headers=["*"],              # or specify ["Authorization", "Content-Type"]
)

def get_db():
    conn = sqlite3.connect(DATABASE, timeout=10)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Customer (
            UserID INTEGER PRIMARY KEY AUTOINCREMENT,
            Name TEXT,
            Email TEXT UNIQUE,
            Password TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()  # Create table if not exists on startup

# Pydantic models
class RegisterUser(BaseModel):
    name: str
    email: EmailStr
    password: str

class LoginUser(BaseModel):
    email: EmailStr
    password: str
class ChangePassword(BaseModel):
    email: EmailStr
    old_password: str
    new_password: str

@app.post("/register")
def register(user: RegisterUser):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Customer WHERE Email = ?", (user.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)
    cursor.execute(
        "INSERT INTO Customer (Name, Email, Password) VALUES (?, ?, ?)",
        (user.name, user.email, hashed_password),
    )
    conn.commit()

    user_id = cursor.lastrowid  # get last inserted UserID
    conn.close()
    return {"message": "User registered successfully", "UserID": user_id}


logged_in_users = {}


@app.post("/login")
def login(user: LoginUser, response: Response):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Customer WHERE Email = ?", (user.email,))
    row = cursor.fetchone()
    conn.close()

    if not row or not pwd_context.verify(user.password, row["Password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    token = str(uuid.uuid4())
    logged_in_users[token] = {"UserID": row["UserID"], "Name": row["Name"], "Email": row["Email"]}

    # Set token in HTTP-only cookie
    response.set_cookie(key="session_token", value=token, httponly=True)

    return {"message": f"Welcome back, {row['Name']}!"}


def get_current_user(session_token: str = Cookie(None)):
    if not session_token or session_token not in logged_in_users:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return logged_in_users[session_token]

@app.get("/debug")
def debug():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()
    conn.close()
    return {"tables": [t[0] for t in tables]}

@app.post("/change-password")
def change_password(data: ChangePassword):
    conn = get_db()
    cursor = conn.cursor()

    # Get user row by email
    cursor.execute("SELECT * FROM Customer WHERE Email = ?", (data.email,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="User not found")

    # Verify old password
    if not pwd_context.verify(data.old_password, row["Password"]):
        conn.close()
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    # Hash new password and update
    hashed_new_password = pwd_context.hash(data.new_password)
    cursor.execute(
        "UPDATE Customer SET Password = ? WHERE Email = ?",
        (hashed_new_password, data.email),
    )
    conn.commit()
    conn.close()

    return {"message": "Password changed successfully"}

@app.get("/events")
def get_events():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT EventID, Name, Date, Time, Location, Availability FROM Event")
    rows = cursor.fetchall()
    conn.close()

    # Convert rows (sqlite3.Row) to list of dicts
    events = [dict(row) for row in rows]
    return {"events": events}

@app.get("/get_available")
def get_available():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT EventID, Name, Date, Time, Location, Availability FROM Event WHERE Availability = 'Available'")
    rows = cursor.fetchall()
    conn.close()
    events = [dict(row) for row in rows]
    return {"available_events": events}

@app.get("/get_purchased")
def get_purchased():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT EventID, Name, Date, Time, Location, Availability FROM Event WHERE Availability = 'Purchased'")
    rows = cursor.fetchall()
    conn.close()
    events = [dict(row) for row in rows]
    return {"purchased_events": events}


class PurchaseRequest(BaseModel):
    event_id: int

@app.post("/purchase")
def purchase_event(purchase: PurchaseRequest, user=Depends(get_current_user)):
    customer_id = user["UserID"]

    conn = get_db()
    cursor = conn.cursor()

    # Check if event exists and is available
    cursor.execute("SELECT Availability FROM Event WHERE EventID = ?", (purchase.event_id,))
    event = cursor.fetchone()
    if not event:
        conn.close()
        raise HTTPException(status_code=404, detail="Event not found")

    if event["Availability"] != "Available":
        conn.close()
        raise HTTPException(status_code=400, detail="Event is not available for purchase")

    # Update event availability to "Purchased"
    cursor.execute("UPDATE Event SET Availability = 'Purchased' WHERE EventID = ?", (purchase.event_id,))

    # Insert purchase record with status "Pending"
    cursor.execute(
        "INSERT INTO Purchased (CustomerID, EventID, Status) VALUES (?, ?, ?)",
        (customer_id, purchase.event_id, "Pending")
    )

    conn.commit()
    conn.close()

    return {"message": "Purchase successful, status set to Pending"}


@app.get("/my_purchases")
def show_user_purchases(user=Depends(get_current_user)):
    customer_id = user["UserID"]

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT Event.EventID, Event.Name, Event.Date, Event.Time, Event.Location, Purchased.Status
        FROM Event
        JOIN Purchased ON Event.EventID = Purchased.EventID
        WHERE Purchased.CustomerID = ?
    """, (customer_id,))
    rows = cursor.fetchall()
    conn.close()

    events = [dict(row) for row in rows]
    return {"my_purchases": events}
