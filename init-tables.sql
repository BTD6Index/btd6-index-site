CREATE COLLATION ignore_accent_case (provider = icu, deterministic = false, locale = 'und-u-ks-level1');

-- Two Towers CHIMPS
CREATE TABLE "twotc_completions" (
    tower1 VARCHAR, tower2 VARCHAR, map VARCHAR, person VARCHAR, link VARCHAR, og BOOLEAN, pending VARCHAR, tsv TSVECTOR, PRIMARY KEY (tower1, tower2, map)
);

-- INSERT trigger
CREATE OR REPLACE FUNCTION twotc_completions_bi_func()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM twotc_completions cmp
        WHERE (cmp.tower1, cmp.tower2, cmp.map) = (NEW.tower1, NEW.tower2, NEW.map)
        OR (cmp.tower1, cmp.tower2, cmp.map) = (NEW.tower2, NEW.tower1, NEW.map)
    ) THEN
        RAISE EXCEPTION 'twotc completion already exists';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER twotc_completions_bi
BEFORE INSERT ON twotc_completions
FOR EACH ROW EXECUTE FUNCTION twotc_completions_bi_func();

-- UPDATE trigger
CREATE OR REPLACE FUNCTION twotc_completions_bu_func()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT (
        (NEW.tower1, NEW.tower2, NEW.map) = (OLD.tower1, OLD.tower2, OLD.map)
        OR (NEW.tower1, NEW.tower2, NEW.map) = (OLD.tower2, OLD.tower1, OLD.map)
    ) AND EXISTS (
        SELECT 1 FROM twotc_completions cmp
        WHERE (cmp.tower1, cmp.tower2, cmp.map) = (NEW.tower1, NEW.tower2, NEW.map)
        OR (cmp.tower1, cmp.tower2, cmp.map) = (NEW.tower2, NEW.tower1, NEW.map)
    ) THEN
        RAISE EXCEPTION 'twotc completion already exists';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER twotc_completions_bu
BEFORE UPDATE ON twotc_completions
FOR EACH ROW EXECUTE FUNCTION twotc_completions_bu_func();

-- TSV update trigger
CREATE OR REPLACE FUNCTION twotc_completions_tsv_func()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tsv := to_tsvector('english', COALESCE(NEW.tower1, '') || ' ' || COALESCE(NEW.tower2, '') || ' ' || COALESCE(NEW.map, '') || ' ' || COALESCE(NEW.person, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER twotc_completions_tsv
BEFORE INSERT OR UPDATE ON twotc_completions
FOR EACH ROW EXECUTE FUNCTION twotc_completions_tsv_func();

CREATE TABLE "twotc_extra_info" (
    tower1 VARCHAR, tower2 VARCHAR, upgrade1 VARCHAR, upgrade2 VARCHAR, version VARCHAR, date VARCHAR, PRIMARY KEY (tower1, tower2)
);
CREATE TABLE "twotc_completion_notes" (
    tower1 VARCHAR, tower2 VARCHAR, map VARCHAR, notes VARCHAR, PRIMARY KEY (tower1, tower2, map)
);

CREATE TABLE "twotc_filekeys" (
    tower1 VARCHAR, tower2 VARCHAR, map VARCHAR, filekey UUID UNIQUE, PRIMARY KEY (tower1, tower2, map)
);

CREATE INDEX twotc_completions_tower1_nocase ON twotc_completions(tower1 COLLATE ignore_accent_case);
CREATE INDEX twotc_completions_tower2_nocase ON twotc_completions(tower2 COLLATE ignore_accent_case);
CREATE INDEX twotc_extra_info_tower1_nocase ON twotc_extra_info(tower1 COLLATE ignore_accent_case);
CREATE INDEX twotc_extra_info_tower2_nocase ON twotc_extra_info(tower2 COLLATE ignore_accent_case);
CREATE INDEX twotc_completion_notes_tower1_nocase ON twotc_completion_notes(tower1 COLLATE ignore_accent_case);
CREATE INDEX twotc_completion_notes_tower2_nocase ON twotc_completion_notes(tower2 COLLATE ignore_accent_case);
CREATE INDEX twotc_filekeys_tower1_nocase ON twotc_filekeys(tower1 COLLATE ignore_accent_case);
CREATE INDEX twotc_filekeys_tower2_nocase ON twotc_filekeys(tower2 COLLATE ignore_accent_case);

CREATE INDEX twotc_person_nocase ON twotc_completions(person COLLATE ignore_accent_case);
CREATE INDEX twotc_completions_tsv_gin ON twotc_completions USING GIN(tsv);

-- 2 Megapops CHIMPS
CREATE TABLE "twomp_completions" (
    entity VARCHAR, map VARCHAR, person VARCHAR, link VARCHAR, og BOOLEAN, pending VARCHAR, tsv TSVECTOR, PRIMARY KEY (entity, map)
);

CREATE TABLE "twomp_extra_info" (
    entity VARCHAR PRIMARY KEY, upgrade VARCHAR, version VARCHAR, date VARCHAR
);
CREATE TABLE "twomp_completion_notes" (
    entity VARCHAR, map VARCHAR, notes VARCHAR, PRIMARY KEY (entity, map)
);

CREATE TABLE "twomp_filekeys" (
    entity VARCHAR, map VARCHAR, filekey UUID UNIQUE, PRIMARY KEY (entity, map)
);

CREATE INDEX twomp_completions_entity_nocase ON twomp_completions(entity COLLATE ignore_accent_case);
CREATE INDEX twomp_extra_info_entity_nocase ON twomp_extra_info(entity COLLATE ignore_accent_case);
CREATE INDEX twomp_completion_notes_entity_nocase ON twomp_completion_notes(entity COLLATE ignore_accent_case);
CREATE INDEX twomp_filekeys_entity_nocase ON twomp_filekeys(entity COLLATE ignore_accent_case);

CREATE INDEX twomp_person_nocase ON twomp_completions(person COLLATE ignore_accent_case);
CREATE INDEX twomp_completions_tsv_gin ON twomp_completions USING GIN(tsv);

-- TSV update trigger
CREATE OR REPLACE FUNCTION twomp_completions_tsv_func()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tsv := to_tsvector('english', COALESCE(NEW.entity, '') || ' ' || COALESCE(NEW.map, '') || ' ' || COALESCE(NEW.person, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER twomp_completions_tsv
BEFORE INSERT OR UPDATE ON twomp_completions
FOR EACH ROW EXECUTE FUNCTION twomp_completions_tsv_func();

-- 2 Towers Co-op CHIMPS
CREATE TABLE "twotcc_completions" (
    tower1 VARCHAR, tower2 VARCHAR, map VARCHAR, person1 VARCHAR, person2 VARCHAR, link VARCHAR, og BOOLEAN, pending VARCHAR, tsv TSVECTOR, PRIMARY KEY (tower1, tower2, map)
);
CREATE TABLE "twotcc_extra_info" (
    tower1 VARCHAR, tower2 VARCHAR, upgrade1 VARCHAR, upgrade2 VARCHAR, version VARCHAR, date VARCHAR, money INTEGER, PRIMARY KEY (tower1, tower2)
);
CREATE TABLE "twotcc_completion_notes" (
    tower1 VARCHAR, tower2 VARCHAR, map VARCHAR, notes VARCHAR, PRIMARY KEY (tower1, tower2, map)
);
CREATE TABLE "twotcc_filekeys" (
    tower1 VARCHAR, tower2 VARCHAR, map VARCHAR, filekey UUID UNIQUE, PRIMARY KEY (tower1, tower2, map)
);

-- INSERT trigger
CREATE OR REPLACE FUNCTION twotcc_completions_bi_func()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM twotcc_completions cmp
        WHERE (cmp.tower1, cmp.tower2, cmp.map) = (NEW.tower1, NEW.tower2, NEW.map)
        OR (cmp.tower1, cmp.tower2, cmp.map) = (NEW.tower2, NEW.tower1, NEW.map)
    ) THEN
        RAISE EXCEPTION 'twotcc completion already exists';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER twotcc_completions_bi
BEFORE INSERT ON twotcc_completions
FOR EACH ROW EXECUTE FUNCTION twotcc_completions_bi_func();

-- UPDATE trigger
CREATE OR REPLACE FUNCTION twotcc_completions_bu_func()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT (
        (NEW.tower1, NEW.tower2, NEW.map) = (OLD.tower1, OLD.tower2, OLD.map)
        OR (NEW.tower1, NEW.tower2, NEW.map) = (OLD.tower2, OLD.tower1, OLD.map)
    ) AND EXISTS (
        SELECT 1 FROM twotcc_completions cmp
        WHERE (cmp.tower1, cmp.tower2, cmp.map) = (NEW.tower1, NEW.tower2, NEW.map)
        OR (cmp.tower1, cmp.tower2, cmp.map) = (NEW.tower2, NEW.tower1, NEW.map)
    ) THEN
        RAISE EXCEPTION 'twotcc completion already exists';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER twotcc_completions_bu
BEFORE UPDATE ON twotcc_completions
FOR EACH ROW EXECUTE FUNCTION twotcc_completions_bu_func();

CREATE INDEX twotcc_completions_tower1_nocase ON twotcc_completions(tower1 COLLATE ignore_accent_case);
CREATE INDEX twotcc_completions_tower2_nocase ON twotcc_completions(tower2 COLLATE ignore_accent_case);
CREATE INDEX twotcc_extra_info_tower1_nocase ON twotcc_extra_info(tower1 COLLATE ignore_accent_case);
CREATE INDEX twotcc_extra_info_tower2_nocase ON twotcc_extra_info(tower2 COLLATE ignore_accent_case);
CREATE INDEX twotcc_completion_notes_tower1_nocase ON twotcc_completion_notes(tower1 COLLATE ignore_accent_case);
CREATE INDEX twotcc_completion_notes_tower2_nocase ON twotcc_completion_notes(tower2 COLLATE ignore_accent_case);
CREATE INDEX twotcc_filekeys_tower1_nocase ON twotcc_filekeys(tower1 COLLATE ignore_accent_case);
CREATE INDEX twotcc_filekeys_tower2_nocase ON twotcc_filekeys(tower2 COLLATE ignore_accent_case);

CREATE INDEX twotcc_person1_nocase ON twotcc_completions(person1 COLLATE ignore_accent_case);
CREATE INDEX twotcc_person2_nocase ON twotcc_completions(person2 COLLATE ignore_accent_case);
CREATE INDEX twotcc_completions_tsv_gin ON twotcc_completions USING GIN(tsv);

-- TSV update trigger
CREATE OR REPLACE FUNCTION twotcc_completions_tsv_func()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tsv := to_tsvector('english', COALESCE(NEW.tower1, '') || ' ' || COALESCE(NEW.tower2, '') || ' ' || COALESCE(NEW.map, '') || ' ' || COALESCE(NEW.person1, '') || ' ' || COALESCE(NEW.person2, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER twotcc_completions_tsv
BEFORE INSERT OR UPDATE ON twotcc_completions
FOR EACH ROW EXECUTE FUNCTION twotcc_completions_tsv_func();

-- Fewest Type of Towers CHIMPS
CREATE TABLE "fttc_completions" (
    map VARCHAR, towerset JSONB, person VARCHAR, link VARCHAR, og BOOLEAN, pending VARCHAR, tsv TSVECTOR, PRIMARY KEY (map, towerset)
);
CREATE TABLE "fttc_extra_info" (
    map VARCHAR, towerset JSONB, version VARCHAR, date VARCHAR, PRIMARY KEY (map, towerset)
);
CREATE TABLE "fttc_completion_notes" (
    map VARCHAR, towerset JSONB, notes VARCHAR, PRIMARY KEY (map, towerset)
);
CREATE TABLE "fttc_filekeys" (
    map VARCHAR, towerset JSONB, filekey UUID UNIQUE, PRIMARY KEY (map, towerset)
);

CREATE INDEX fttc_person_nocase ON fttc_completions(person COLLATE ignore_accent_case);
CREATE INDEX fttc_completions_tsv_gin ON fttc_completions USING GIN(tsv);

-- TSV update trigger
CREATE OR REPLACE FUNCTION fttc_completions_tsv_func()
RETURNS TRIGGER AS $$
DECLARE
    tower_text TEXT;
BEGIN
    -- Extract tower names from JSON array and concatenate them
    IF NEW.towerset IS NOT NULL AND NEW.towerset::jsonb != 'null'::jsonb THEN
        SELECT string_agg(elem, ' ') INTO tower_text
        FROM jsonb_array_elements_text(NEW.towerset::jsonb) AS elem;
    ELSE
        tower_text := '';
    END IF;
    
    NEW.tsv := to_tsvector('english', COALESCE(tower_text, '') || ' ' || COALESCE(NEW.map, '') || ' ' || COALESCE(NEW.person, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER fttc_completions_tsv
BEFORE INSERT OR UPDATE ON fttc_completions
FOR EACH ROW EXECUTE FUNCTION fttc_completions_tsv_func();

-- Least Towers CHIMPS
CREATE TABLE "ltc_completions" (
    map VARCHAR, towerset JSONB, person VARCHAR, link VARCHAR, completiontype VARCHAR, pending VARCHAR,
    upgradeset JSONB, version VARCHAR, date VARCHAR, notes VARCHAR, filekey UUID UNIQUE, tsv TSVECTOR, PRIMARY KEY (map, towerset, completiontype)
);

CREATE INDEX ltc_person_nocase ON ltc_completions(person COLLATE ignore_accent_case);
CREATE INDEX ltc_completions_tsv_gin ON ltc_completions USING GIN(tsv);

-- TSV update trigger
CREATE OR REPLACE FUNCTION ltc_completions_tsv_func()
RETURNS TRIGGER AS $$
DECLARE
    tower_text TEXT;
BEGIN
    -- Extract tower names from JSON array and concatenate them
    IF NEW.towerset IS NOT NULL AND NEW.towerset::jsonb != 'null'::jsonb THEN
        SELECT string_agg(elem, ' ') INTO tower_text
        FROM jsonb_array_elements_text(NEW.towerset::jsonb) AS elem;
    ELSE
        tower_text := '';
    END IF;
    
    NEW.tsv := to_tsvector('english', COALESCE(tower_text, '') || ' ' || COALESCE(NEW.map, '') || ' ' || COALESCE(NEW.person, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ltc_completions_tsv
BEFORE INSERT OR UPDATE ON ltc_completions
FOR EACH ROW EXECUTE FUNCTION ltc_completions_tsv_func();

-- Least Cost CHIMPS
CREATE TABLE "lcc_completions" (
    map VARCHAR, money INTEGER, person VARCHAR, link VARCHAR, pending VARCHAR,
    version VARCHAR, date VARCHAR, notes VARCHAR, filekey UUID PRIMARY KEY, tsv TSVECTOR
);
CREATE INDEX lcc_person_nocase ON lcc_completions(person COLLATE ignore_accent_case);
CREATE INDEX lcc_completions_tsv_gin ON lcc_completions USING GIN(tsv);

-- TSV update trigger
CREATE OR REPLACE FUNCTION lcc_completions_tsv_func()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tsv := to_tsvector('english', COALESCE(NEW.map, '') || ' ' || COALESCE(NEW.person, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lcc_completions_tsv
BEFORE INSERT OR UPDATE ON lcc_completions
FOR EACH ROW EXECUTE FUNCTION lcc_completions_tsv_func();

-- Least Cost Deflation
CREATE TABLE "lcd_completions" (
    map VARCHAR, money INTEGER, person VARCHAR, link VARCHAR, pending VARCHAR,
    version VARCHAR, date VARCHAR, notes VARCHAR, filekey UUID PRIMARY KEY, tsv TSVECTOR
);
CREATE INDEX lcd_person_nocase ON lcd_completions(person COLLATE ignore_accent_case);
CREATE INDEX lcd_completions_tsv_gin ON lcd_completions USING GIN(tsv);

-- TSV update trigger
CREATE OR REPLACE FUNCTION lcd_completions_tsv_func()
RETURNS TRIGGER AS $$
BEGIN
    NEW.tsv := to_tsvector('english', COALESCE(NEW.map, '') || ' ' || COALESCE(NEW.person, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER lcd_completions_tsv
BEFORE INSERT OR UPDATE ON lcd_completions
FOR EACH ROW EXECUTE FUNCTION lcd_completions_tsv_func();

CREATE TABLE map_information(
    map VARCHAR PRIMARY KEY,
    abbreviation VARCHAR,
    difficulty VARCHAR,
    haslos BOOLEAN,
    haswater BOOLEAN,
    length REAL,
    lengthnotes VARCHAR,
    miscnotes VARCHAR,
    numentrances INTEGER,
    numexits INTEGER,
    numobjects INTEGER,
    removalcost VARCHAR,
    removalcostnotes VARCHAR,
    version VARCHAR
);

CREATE TABLE chimps_starts(map VARCHAR, title VARCHAR, link VARCHAR, uuid VARCHAR PRIMARY KEY);
CREATE INDEX chimps_starts_map_idx ON chimps_starts(map);

CREATE TABLE balance_changes(tower VARCHAR, version VARCHAR, change VARCHAR, nature VARCHAR, uuid VARCHAR PRIMARY KEY);
CREATE INDEX balance_changes_tower_idx ON balance_changes(tower);
CREATE INDEX balance_changes_version_idx ON balance_changes(version);
CREATE INDEX balance_changes_tower_version_idx ON balance_changes(tower, version);
