INSERT INTO Districts (name, area_id, created_at, updated_at)
VALUES 
    ('台北市', (SELECT id FROM Areas WHERE name = '臺灣北部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('新北市', (SELECT id FROM Areas WHERE name = '臺灣北部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('桃園市', (SELECT id FROM Areas WHERE name = '臺灣北部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('新竹市', (SELECT id FROM Areas WHERE name = '臺灣北部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('新竹縣', (SELECT id FROM Areas WHERE name = '臺灣北部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('宜蘭縣', (SELECT id FROM Areas WHERE name = '臺灣北部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('基隆市', (SELECT id FROM Areas WHERE name = '臺灣北部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('台中市', (SELECT id FROM Areas WHERE name = '臺灣中部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('彰化縣', (SELECT id FROM Areas WHERE name = '臺灣中部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('雲林縣', (SELECT id FROM Areas WHERE name = '臺灣中部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('苗栗縣', (SELECT id FROM Areas WHERE name = '臺灣中部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('南投縣', (SELECT id FROM Areas WHERE name = '臺灣中部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('高雄市', (SELECT id FROM Areas WHERE name = '臺灣南部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('台南市', (SELECT id FROM Areas WHERE name = '臺灣南部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('嘉義市', (SELECT id FROM Areas WHERE name = '臺灣南部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('嘉義縣', (SELECT id FROM Areas WHERE name = '臺灣南部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('屏東縣', (SELECT id FROM Areas WHERE name = '臺灣南部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('台東縣', (SELECT id FROM Areas WHERE name = '臺灣東部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('花蓮縣', (SELECT id FROM Areas WHERE name = '臺灣東部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('澎湖縣', (SELECT id FROM Areas WHERE name = '臺灣東部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('金門縣', (SELECT id FROM Areas WHERE name = '臺灣東部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('連江縣', (SELECT id FROM Areas WHERE name = '臺灣東部'), CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);