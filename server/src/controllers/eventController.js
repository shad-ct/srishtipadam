const Event = require('../models/Event');
const asyncHandler = require('../utils/asyncHandler');
const { deleteFromCloudinary } = require('../utils/cloudinaryUpload');

const getEvents = asyncHandler(async (req, res) => {
  const { type } = req.query; // 'upcoming' or 'past'
  const filter = {};
  
  if (type === 'upcoming') {
    filter.isUpcoming = true;
  } else if (type === 'past') {
    filter.isUpcoming = false;
  }

  const events = await Event.find(filter).sort(type === 'upcoming' ? 'date' : '-date');
  res.json(events);
});

const createEvent = asyncHandler(async (req, res) => {
  const event = new Event(req.body);
  const createdEvent = await event.save();
  res.status(201).json(createdEvent);
});

const updateEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    Object.assign(event, req.body);
    const updatedEvent = await event.save();
    res.json(updatedEvent);
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

const deleteEvent = asyncHandler(async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (event) {
    // Cleanup Cloudinary resources
    if (event.images && event.images.length > 0) {
      for (const img of event.images) {
        if (img.publicId) await deleteFromCloudinary(img.publicId);
      }
    }
    if (event.videos && event.videos.length > 0) {
      for (const vid of event.videos) {
        if (vid.publicId) await deleteFromCloudinary(vid.publicId);
      }
    }
    await event.deleteOne();
    res.json({ message: 'Event removed' });
  } else {
    res.status(404);
    throw new Error('Event not found');
  }
});

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
