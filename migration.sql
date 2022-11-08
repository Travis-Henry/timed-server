DROP TABLE IF EXISTS aircraft;

CREATE TABLE aircraft(
    aircraft_id SERIAL,
    aircraft_name VARCHAR(100),
    top_speed INTEGER,
    aircraft_type VARCHAR(100)
);
