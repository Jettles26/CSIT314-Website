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

from fastapi import Request  # add this if not imported yet
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
class CreateEvent(BaseModel):
    name: str
    date: str
    time: str
    location: str
    quantity: int  # NEW
    description: str
    vip: int

class LoginAdmin(BaseModel):
    email: EmailStr
    password: str


class RegisterAdmin(BaseModel):
    name: str
    email: EmailStr
    password: str


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

class DeleteEventRequest(BaseModel):
    event_id: int


@app.post("/registerCustomer")
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


logged_in_users = {}       # For customers
logged_in_admins = {}      # For admins



@app.post("/loginCustomer")
def login(user: LoginUser, response: Response, request: Request):
    session_token = request.cookies.get("session_token")

    # Check if user is already logged in as admin
    if session_token and session_token in logged_in_admins:
        raise HTTPException(status_code=403, detail="Already logged in as an admin. Please log out first.")

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

@app.post("/customer_ChangePassword")
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

@app.get("/all_Events")
def get_events():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT EventID, Name, Quantity, Date, Time, Location, Availability, Details, Vip FROM Event")
    rows = cursor.fetchall()
    conn.close()
    return {"events": [dict(row) for row in rows]}

@app.get("/all_GetAvailable")
def get_available():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT EventID, Name, Quantity, Date, Time, Location, Availability, Details, Vip FROM Event WHERE Availability = 'Available'")
    rows = cursor.fetchall()
    conn.close()
    return {"available_events": [dict(row) for row in rows]}



class PurchaseRequest(BaseModel):
    event_id: int

@app.post("/customer_Purchase")
def purchase_event(purchase: PurchaseRequest, user=Depends(get_current_user)):
    customer_id = user["UserID"]

    conn = get_db()
    cursor = conn.cursor()

    # Check current quantity and availability
    cursor.execute("SELECT Quantity, Availability FROM Event WHERE EventID = ?", (purchase.event_id,))
    event = cursor.fetchone()

    if not event:
        conn.close()
        raise HTTPException(status_code=404, detail="Event not found")

    if event["Availability"] != "Available":
        conn.close()
        raise HTTPException(status_code=400, detail="Event is not available for purchase")

    if event["Quantity"] <= 0:
        conn.close()
        raise HTTPException(status_code=400, detail="Tickets sold out")

    # Decrease quantity
    new_quantity = event["Quantity"] - 1

    # Update quantity, possibly availability
    if new_quantity == 0:
        cursor.execute("""
            UPDATE Event SET Quantity = 0, Availability = 'Purchased' WHERE EventID = ?
        """, (purchase.event_id,))
    else:
        cursor.execute("UPDATE Event SET Quantity = ? WHERE EventID = ?", (new_quantity, purchase.event_id))

    # Insert into Purchased table
    cursor.execute("""
        INSERT INTO Purchased (CustomerID, EventID, Status)
        VALUES (?, ?, ?)
    """, (customer_id, purchase.event_id, "Pending"))

    conn.commit()
    conn.close()

    return {"message": "Purchase successful Thank you"}


@app.get("/customer_My_purchases")
def show_user_purchases(user=Depends(get_current_user)):
    customer_id = user["UserID"]

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT Event.EventID, Event.Name, Event.Date, Event.Time, Event.Location, Event.Details, Event.Vip, Purchased.Status
        FROM Event
        JOIN Purchased ON Event.EventID = Purchased.EventID
        WHERE Purchased.CustomerID = ?
    """, (customer_id,))
    rows = cursor.fetchall()
    conn.close()

    events = [dict(row) for row in rows]
    return {"my_purchases": events}




@app.get("/admin_All_purchases")
def get_all_purchases():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            Purchased.PaymentID,
            Customer.Name AS CustomerName,
            Customer.Email,
            Event.EventID,
            Event.Name AS EventName,
            Event.Date,
            Event.Time,
            Event.Location,
            Event.Details,
            Event.Vip,
            Purchased.Status
        FROM Purchased
        JOIN Customer ON Purchased.CustomerID = Customer.UserID
        JOIN Event ON Purchased.EventID = Event.EventID
    """)
    rows = cursor.fetchall()
    conn.close()

    purchases = [dict(row) for row in rows]
    return {"all_purchases": purchases}

@app.post("/registerAdmin")
def register_admin(admin: RegisterAdmin):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Admin WHERE Email = ?", (admin.email,))
    if cursor.fetchone():
        conn.close()
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(admin.password)
    cursor.execute(
        "INSERT INTO Admin (Name, Email, Password) VALUES (?, ?, ?)",
        (admin.name, admin.email, hashed_password),
    )
    conn.commit()

    admin_id = cursor.lastrowid  # get last inserted AdminID
    conn.close()
    return {"message": "Admin registered successfully", "AdminID": admin_id}



@app.post("/loginAdmin")
def login_admin(admin: LoginAdmin, response: Response, request: Request):
    session_token = request.cookies.get("session_token")

    # Check if user is already logged in as customer
    if session_token and session_token in logged_in_users:
        raise HTTPException(status_code=403, detail="Already logged in as a customer. Please log out first.")

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Admin WHERE Email = ?", (admin.email,))
    row = cursor.fetchone()
    conn.close()

    if not row or not pwd_context.verify(admin.password, row["Password"]):
        raise HTTPException(status_code=400, detail="Invalid email or password")

    # Generate token and store admin session
    token = str(uuid.uuid4())
    logged_in_admins[token] = {
        "AdminID": row["AdminID"],
        "Name": row["Name"],
        "Email": row["Email"]
    }

    response.set_cookie(key="session_token", value=token, httponly=True)

    return {"message": f"Welcome, Admin {row['Name']}!"}

class ChangePasswordAdmin(BaseModel):
    email: EmailStr
    old_password: str
    new_password: str

def get_current_admin(session_token: str = Cookie(None)):
    if not session_token or session_token not in logged_in_admins:
        raise HTTPException(status_code=401, detail="Not authenticated as admin")
    return logged_in_admins[session_token]

@app.post("/change-password-admin")
def change_password_admin(data: ChangePasswordAdmin, admin=Depends(get_current_admin)):
    if admin["Email"] != data.email:
        raise HTTPException(status_code=403, detail="You can only change your own password")

    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM Admin WHERE Email = ?", (data.email,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Admin not found")

    if not pwd_context.verify(data.old_password, row["Password"]):
        conn.close()
        raise HTTPException(status_code=400, detail="Old password is incorrect")

    hashed_new_password = pwd_context.hash(data.new_password)
    cursor.execute(
        "UPDATE Admin SET Password = ? WHERE Email = ?",
        (hashed_new_password, data.email),
    )
    conn.commit()
    conn.close()

    return {"message": "Admin password changed successfully"}

from fastapi import Response, Cookie

@app.post("/all_Logout")
def logout(response: Response, session_token: str = Cookie(None)):
    if not session_token:
        raise HTTPException(status_code=400, detail="No session token provided")

    # Remove from customer sessions if present
    if session_token in logged_in_users:
        del logged_in_users[session_token]
    # Remove from admin sessions if present
    elif session_token in logged_in_admins:
        del logged_in_admins[session_token]
    else:
        raise HTTPException(status_code=401, detail="Invalid or expired session token")

    # Clear cookie by setting empty value and immediate expiration
    response.delete_cookie("session_token")

    return {"message": "Logged out successfully"}

@app.post("/admin_AddEvent")
def add_event(event: CreateEvent, admin=Depends(get_current_admin)):
    conn = get_db()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO Event (Name, Quantity, Date, Time, Location, Availability, Details, Vip)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (event.name, event.quantity, event.date, event.time, event.location, "Available", event.description, event.vip))

    conn.commit()
    event_id = cursor.lastrowid
    conn.close()

    return {"message": "Event added successfully", "EventID": event_id}


@app.post("/admin_DeleteEvent")
def delete_event(request: DeleteEventRequest, admin=Depends(get_current_admin)):
    conn = get_db()
    cursor = conn.cursor()

    # Check if event exists and is marked as 'Available'
    cursor.execute("SELECT * FROM Event WHERE EventID = ? AND Availability = 'Available'", (request.event_id,))
    event = cursor.fetchone()

    if not event:
        conn.close()
        raise HTTPException(status_code=404, detail="Event not found or not available for deletion")

    # Delete the event
    cursor.execute("DELETE FROM Event WHERE EventID = ?", (request.event_id,))
    conn.commit()
    conn.close()

    return {"message": f"Event ID {request.event_id} has been deleted successfully"}


from pydantic import BaseModel

class UpdateDescriptionRequest(BaseModel):
    event_id: int
    new_description: str

@app.put("/admin_updateDescription")
def update_event_description(data: UpdateDescriptionRequest, admin=Depends(get_current_admin)):
    conn = get_db()
    cursor = conn.cursor()

    # Check if the event exists
    cursor.execute("SELECT * FROM Event WHERE EventID = ?", (data.event_id,))
    event = cursor.fetchone()
    if not event:
        conn.close()
        raise HTTPException(status_code=404, detail="Event not found.")

    # Update the description
    cursor.execute("UPDATE Event SET Details = ? WHERE EventID = ?", (data.new_description, data.event_id))
    conn.commit()
    conn.close()

    return {"message": f"Description for EventID {data.event_id} updated successfully."}