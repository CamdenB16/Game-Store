import React, { useEffect, useState } from "react";

import teamData from "../assets/data.json";

const TheTeam = () => {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    setTeam(teamData.team || []);
  }, []);

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email).then(() => {
      alert(`Email copied: ${email}`);
    });
  };

  return (
    <main>
      <h1 style={{ textAlign: "center", color: "whitesmoke", padding: 10 }}>
        <strong>
          <u>Meet the Developers</u>
        </strong>
      </h1>
      <h3 style={{ textAlign: "center", color: "whitesmoke", padding: 10 }}>
        Construction of User Interfaces, Spring 2025
      </h3>

      <div className="album py-5 bg-body-tertiary">
        <div className="container">
          <div className="d-flex justify-content-center flex-wrap gap-4">
            {team.map((dev, i) => (
              <div key={dev.email} className="d-flex justify-content-center">
                <div
                  className="card shadow-sm"
                  style={{ width: "22rem", borderRadius: 0 }}
                >
                  <img
                    src={dev.url}
                    className="card-img-top"
                    alt="Developer"
                    style={{
                      height: 300,
                      objectFit: "cover",
                      borderRadius: 0,
                      filter: i === 1 ? "invert(100%)" : "none",
                    }}
                  />
                  <div className="card-body text-center">
                    <p className="card-text">
                      <strong>{dev.name}</strong>
                      <br />
                      {dev.role}
                    </p>
                    <p className="email-text mb-2">
                      <strong>Email:</strong> <span>{dev.email}</span>
                    </p>
                    <div className="d-flex justify-content-center">
                      <button
                        className="btn btn-sm btn-outline-secondary"
                        onClick={() => handleCopyEmail(dev.email)}
                      >
                        Copy Email
                      </button>
                    </div>
                    <small className="text-body-secondary d-block mt-2">
                      {dev.date}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default TheTeam;