import * as React from 'react';
import "../Pages/Events.css";

const Checkbox = ({onToggle}) => {
  const [checked, setChecked] = React.useState(false);

  const handleChange = () => {
    setChecked(!checked);
    onToggle(!checked);
  };

  return (
    <div className="Checkbox">
      <label>
        <input type="checkbox" checked={checked} onChange={handleChange}/>
        VIP
      </label>
    </div>
  );
};

export default Checkbox;