import db from '../models';
import crypto from 'crypto';

const encryptOption = 'compress-algo=1, cipher-algo=aes256';

const getRandomKey = () => {
  return crypto.randomBytes(64);
};

export const storeToken = async (repositoryId: number) => {
  return await db.integration.create({
    repository_id: repositoryId,
    token: db.Sequelize.fn('PGP_SYM_ENCRYPT', getRandomKey(), encryptOption),
  });
};

export const findByToken = async (token: string) => {
  return await db.integration.findOne({
    where: db.Sequelize.where(
      db.Sequelize.fn(
        'PGP_SYM_DECRYPT',
        db.Sequelize.cast(db.Sequelize.col('token'), 'bytea'),
        encryptOption
      ),
      token
    ),
  });
};
