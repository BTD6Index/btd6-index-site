CREATE VIRTUAL TABLE '2tc_completions' USING fts5(tower1, tower2, map, person, link, og);
CREATE VIRTUAL TABLE '2mp_completions' USING fts5(entity, map, person, link, og);
CREATE TABLE '2tc_extra_info' (tower1, tower2, upgrade1, upgrade2, version, date, PRIMARY KEY (tower1, tower2));
CREATE TABLE '2mp_extra_info' (entity PRIMARY KEY, upgrade, version, date);
