import ctrl from './controller';
import Express from 'express';

const router = Express.Router();

router.put('/api/translations', (req, res) => ctrl.modify(req, res));

router.post('/api/translations/getTransByKey', (req, res) => ctrl.getTransByKey(req, res));


export default router;
