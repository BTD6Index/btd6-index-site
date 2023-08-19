-- 2 Towers CHIMPS
CREATE TABLE "2tc_completions" (
    tower1, tower2, map, person, link, og, pending, PRIMARY KEY (tower1, tower2, map)
);
CREATE VIRTUAL TABLE "2tc_completions_fts" USING fts5(
    tower1, tower2, map, person, link, og, pending UNINDEXED, content='2tc_completions', tokenize='unicode61 remove_diacritics 2', prefix='1 2 3'
);

CREATE TRIGGER "2tc_completions_ai" AFTER INSERT ON '2tc_completions' BEGIN 
    INSERT INTO "2tc_completions_fts" (rowid, tower1, tower2, map, person, link, og, pending) VALUES (new.rowid, new.tower1, new.tower2, new.map, new.person, new.link, new.og, new.pending);
END;
CREATE TRIGGER "2tc_completions_ad" AFTER DELETE ON '2tc_completions' BEGIN 
    INSERT INTO "2tc_completions_fts" ('2tc_completions_fts', rowid, tower1, tower2, map, person, link, og, pending) VALUES ('delete', old.rowid, old.tower1, old.tower2, old.map, old.person, old.link, old.og, old.pending);
END;
CREATE TRIGGER "2tc_completions_au" AFTER UPDATE ON '2tc_completions' BEGIN 
    INSERT INTO "2tc_completions_fts" ('2tc_completions_fts', rowid, tower1, tower2, map, person, link, og, pending) VALUES ('delete', old.rowid, old.tower1, old.tower2, old.map, old.person, old.link, old.og, old.pending);

    INSERT INTO "2tc_completions_fts" (rowid, tower1, tower2, map, person, link, og, pending) VALUES (new.rowid, new.tower1, new.tower2, new.map, new.person, new.link, new.og, new.pending);
END;

CREATE TABLE "2tc_extra_info" (
    tower1, tower2, upgrade1, upgrade2, version, date, PRIMARY KEY (tower1, tower2)
);
CREATE TABLE "2tc_completion_notes" (
    tower1, tower2, map, notes, PRIMARY KEY (tower1, tower2, map)
);

CREATE TABLE "2tc_filekeys" (
    tower1, tower2, map, filekey UNIQUE, PRIMARY KEY (tower1, tower2, map)
);

-- 2 Megapops CHIMPS
CREATE TABLE "2mp_completions" (
    entity, map, person, link, og, pending, PRIMARY KEY (entity, map)
);
CREATE VIRTUAL TABLE "2mp_completions_fts" USING fts5(
    entity, map, person, link, og, pending UNINDEXED, content='2mp_completions', tokenize='unicode61 remove_diacritics 2', prefix='1 2 3'
);
CREATE TRIGGER "2mp_completions_ai" AFTER INSERT ON '2mp_completions' BEGIN 
    INSERT INTO "2mp_completions_fts" (rowid, entity, map, person, link, og, pending) VALUES (new.rowid, new.entity, new.map, new.person, new.link, new.og, new.pending);
END;
CREATE TRIGGER "2mp_completions_ad" AFTER DELETE ON '2mp_completions' BEGIN 
    INSERT INTO "2mp_completions_fts" ('2mp_completions_fts', rowid, entity, map, person, link, og, pending) VALUES ('delete', old.rowid, old.entity, old.map, old.person, old.link, old.og, old.pending);
END;
CREATE TRIGGER "2mp_completions_au" AFTER UPDATE ON '2mp_completions' BEGIN 
    INSERT INTO "2mp_completions_fts" ('2mp_completions_fts', rowid, entity, map, person, link, og, pending) VALUES ('delete', old.rowid, old.entity, old.map, old.person, old.link, old.og, old.pending);

    INSERT INTO "2mp_completions_fts" (rowid, entity, map, person, link, og, pending) VALUES (new.rowid, new.entity, new.map, new.person, new.link, new.og, new.pending);
END;

CREATE TABLE "2mp_extra_info" (
    entity PRIMARY KEY, upgrade, version, date
);
CREATE TABLE "2mp_completion_notes" (
    entity, map, notes, PRIMARY KEY (entity, map)
);

CREATE TABLE "2mp_filekeys" (
    entity, map, filekey UNIQUE, PRIMARY KEY (entity, map)
);

-- Others
CREATE TABLE "fttc_completions" (
    towerset, map PRIMARY KEY, person, link, og, version, date
);
CREATE TABLE "ltc_completions" (
    towerset, map PRIMARY KEY, person, link, og, upgradeset, version, date
);
CREATE TABLE "lcc_completions" (map PRIMARY KEY, cost, version, date, person, link);
