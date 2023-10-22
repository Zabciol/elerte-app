import React, { useState } from "react";

const NewEmployeeSupervisor = () => {
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [selectedSubordinates, setSelectedSubordinates] = useState([]);

  const availableEmployees = [
    // Pobierz tę listę z bazy danych
    { id: 1, name: "Jan Kowalski" },
    { id: 2, name: "Anna Nowak" },
    // ...
  ];

  return (
    // ...
    <div>
      <label>
        Czy chcesz być kierownikiem?
        <input
          type='checkbox'
          checked={isSupervisor}
          onChange={(e) => setIsSupervisor(e.target.checked)}
        />
      </label>

      {isSupervisor && (
        <div>
          Wybierz podwładnych:
          {availableEmployees.map((emp) => (
            <label key={emp.id}>
              <input
                type='checkbox'
                value={emp.id}
                checked={selectedSubordinates.includes(emp.id)}
                onChange={(e) => {
                  const updated = [...selectedSubordinates];
                  if (e.target.checked) {
                    updated.push(emp.id);
                  } else {
                    const index = updated.indexOf(emp.id);
                    if (index > -1) updated.splice(index, 1);
                  }
                  setSelectedSubordinates(updated);
                }}
              />
              {emp.name}
            </label>
          ))}
        </div>
      )}
    </div>
    // ...
  );
};

export default NewEmployeeSupervisor;
