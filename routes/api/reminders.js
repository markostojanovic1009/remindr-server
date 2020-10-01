const router      = require('express').Router();
const auth        = require('../auth');
const Reminder    = require("../../models").Reminder;
const User = require("../../models").User;
const { Op } = require("sequelize");

router.post('/create', auth.required, async (req, res, next) => {

    const reminder = req.body;
    delete reminder.id;

    try
    {
        const reminderObject = await Reminder.create(reminder);
        const users = await User.findAll({
            where: {
                email: {
                    [Op.in]: reminder.userEmails
                }
            }
        });
        await reminderObject.setUsers(users.map(user => user.id));
        return res.status(200).json(reminderObject);
    }
    catch (err)
    {
        console.log(err);
        return res.status(400).json({
            errors: err
        })
    }
});

router.delete('/:reminderId', auth.required, async (req, res, next) => {
    const reminderId = req.params.reminderId;
    const reminder = await Reminder.findByPk(reminderId);
    if (reminder != null)
    {
        await reminder.destroy();
    }
    return res.status(204).send();
});

router.get('/', auth.required, async (req, res, next) => {

    if (!req.query.after)
    {
        const reminders = await Reminder.findAll();
        return res.status(200).json(reminders);
    }
    else
    {
        const user = await User.findOne({
            where: {
                email: req.query.user
            },
            include: [{
                model: Reminder,
                where: {
                    time: {
                        [Op.gt]: req.query.after
                    }
                }
            }]
        });
        result = user == null ? [] : user.Reminders
        return res.json(result);
    }
});

router.get('/:reminderId', auth.required, async (req, res, next) => {
    Reminder.findByPk(req.params.reminderId).then(reminder => {
		return res.status(200).json(reminder);
	});
});


module.exports = router;
