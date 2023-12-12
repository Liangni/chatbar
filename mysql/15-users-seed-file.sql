INSERT INTO Users (account, password, birthday, avatar, intro, gender_id, district_id, created_at, updated_at)
VALUES
    (
        'user1',
        '$2a$10$h3aVUCU5EQutIHoNaQY4L.hyCv673va9f/I9DqEANoF5jNnNROuDi',
        '1991-02-01',
        'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80',
        'Cumque unde laborum praesentium voluptatem possimus reprehenderit qui esse non. Deserunt laudantium explicabo atque et sit cumque. Consequuntur sapiente perspiciatis aperiam doloribus similique. Doloribus in expedita inventore. Eaque porro rerum consequatur doloribus delectus recusandae.',
        (SELECT id FROM Genders WHERE name = '男性'),
        (SELECT id FROM Districts WHERE name = '台北市'),
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'user2',
        '$2a$10$uDtAzN7GiaV2RZfyeASgM.9J2BL/khZjf0lI55gLRM4zHSPRMkesO',
        '1994-03-01',
        'https://images.unsplash.com/photo-1618287520963-df8f2ab53c91?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=464&q=80',
        'Tempore reprehenderit perspiciatis id eveniet. Eius sed aliquam inventore fugit voluptatem et et. Omnis molestias molestiae aliquid voluptatibus.',
        (SELECT id FROM Genders WHERE name = '女性'),
        (SELECT id FROM Districts WHERE name = '台中市'),
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),
    (
        'user3',
        '$2a$10$vmXCOnbQl0kXUM1KWXODI.57z60XmZ8Fyr83qYGyLUQAdifN2h2ki',
        '1998-05-01',
        'https://images.unsplash.com/photo-1504131598085-4cca8500b677?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=869&q=80',
        'Ut eligendi ullam ea fugit quo. Temporibus laudantium recusandae enim cupiditate enim sint vel. Maiores suscipit cumque optio itaque assumenda eum. Nisi est delectus aut laudantium rerum quia dolor voluptas. Esse et labore eum eius cupiditate dolor exercitationem odio.',
        (SELECT id FROM Genders WHERE name = '其他'),
        (SELECT id FROM Districts WHERE name = '高雄市'),
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );