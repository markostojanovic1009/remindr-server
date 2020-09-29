const Joi         = require('joi');
const router      = require('express').Router();
const auth        = require('../auth');
const Reminder    = require("../../models").Reminder;
const { Op } = require("sequelize");


const reminderSchema = Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().max(200).optional(),
    time: Joi.number().required()
});

router.post('/create', auth.required, async (req, res, next) => {

    const reminder = req.body;
    delete reminder.id;
    const result = Joi.validate(reminder, reminderSchema);

    if (result.error)
    {
        console.log(result.error);
        return res.status(422).json({
            errors: result.error
        });
    }

    try
    {
        const reminderObject = await Reminder.create(reminder);
        return res.status(200).json(reminderObject);
    }
    catch (err)
    {
        return res.status(400).json({
            errors: err
        })
    }
});

router.delete('/:reminderId', auth.required, async (req, res, next) => {

    const reminderId = req.params.reminderId;

    const reminder = await Reminder.findByPk(reminderId);
    await reminder.destroy();
    return res.status(204).send();

});

router.get('/', auth.required, async (req, res, next) => {

    if (!req.query.after)
    {
        Reminder.findAll().then(reminders => {

            return res.status(200).json(reminders);
        });
    }
    else
    {
        Reminder.findAll({
            where: {
                time: {
                    [Op.gt]: req.query.after
                }
            }
        }).then(reminders => {
            return res.json(reminders);
        });
    }
});

router.get('/:reminderId', auth.required, async (req, res, next) => {
    Reminder.findByPk(req.params.reminderId).then(reminder => {
		return res.status(200).json(reminder);
	});
});


module.exports = router;
