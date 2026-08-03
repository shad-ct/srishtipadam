const Setting = require('../models/Setting');
const asyncHandler = require('../utils/asyncHandler');

// @desc    Get setting by key
// @route   GET /api/settings/:key
// @access  Public
const getSetting = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const setting = await Setting.findOne({ key });
  
  if (setting) {
    res.json(setting);
  } else {
    // Return a default value instead of 404 for ease of frontend consumption
    let defaultValue = '';
    if (key === 'quarterlyMagazinePrice') {
      defaultValue = '150';
    } else if (key === 'annualEditionPrice') {
      defaultValue = '399';
    }
    res.json({ key, value: defaultValue });
  }
});

// @desc    Update/upsert setting by key
// @route   PUT /api/settings/:key
// @access  Private/Admin
const updateSetting = asyncHandler(async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;

  let setting = await Setting.findOne({ key });

  if (setting) {
    setting.value = value;
    setting = await setting.save();
  } else {
    setting = new Setting({ key, value });
    setting = await setting.save();
  }

  res.json(setting);
});

module.exports = {
  getSetting,
  updateSetting,
};
