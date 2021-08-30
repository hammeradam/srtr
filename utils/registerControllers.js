import path from 'path';
import authController from '../controllers/authController.js';
import linkController from '../controllers/linkController.js';
import { Link } from '../models/link.js';



export const registerControllers = (app, dirname) => {
    app.use('/api/auth', authController);
    app.use('/api/url', linkController);

    app.get('/:name', async (req, res) => {
        const link = await Link.findOne({ name: req.params.name });
        if (!link) {
            res.status(404);
            return res.sendFile(path.join(dirname + '/pages/404.html'));
        }
    
        if (link.limit && link.limit <= link.hitCount) {
            res.status(404);
            return res.sendFile(path.join(dirname + '/pages/404.html'));
        }
    
        await link.updateOne({ hitCount: ++link.hitCount });

        if (link.password) {
            req.session.name = link.name;
            return res.sendFile(path.join(dirname + '/pages/password.html'));
        }
    
        res.redirect(link.url);
    });
};
