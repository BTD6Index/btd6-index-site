CREATE VIRTUAL TABLE '2tc_completions' USING fts5(
    tower1, tower2, map, person, link, og, pending UNINDEXED, tokenize="unicode61 remove_diacritics 2", prefix='1 2 3'
);
CREATE VIRTUAL TABLE '2mp_completions' USING fts5(
    entity, map, person, link, og, pending UNINDEXED, tokenize="unicode61 remove_diacritics 2", prefix='1 2 3'
);
CREATE TABLE '2tc_extra_info' (
    tower1, tower2, upgrade1, upgrade2, version, date, PRIMARY KEY (tower1, tower2)
);
CREATE TABLE '2mp_extra_info' (
    entity PRIMARY KEY, upgrade, version, date
);
CREATE TABLE 'fttc_completions' (
    towerset, map PRIMARY KEY, person, link, og, version, date
);
CREATE TABLE 'ltc_completions' (
    towerset, map PRIMARY KEY, person, link, og, upgradeset, version, date
);
CREATE TABLE 'lcc_completions' (map PRIMARY KEY, cost, version, date, person, link);
