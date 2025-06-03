import * as React from 'react';
import "../Pages/Events.css";

const Button = () => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <div className="Button">
      <button onClick={handleChange}>
        Purchase
      </button>
    </div>
  );
};

export default Button;