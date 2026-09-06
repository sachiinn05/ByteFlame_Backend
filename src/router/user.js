const express = require("express");
const mongoose = require("mongoose");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../model/connectionRequest");
const User = require("../model/user");
const { Chat } = require("../model/chat");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// Get all the pending connection request for the loggedIn user
userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try{
       const loggedInUser=req.user;
       const connectionRequest=await ConnectionRequest.find({
        toUserId:loggedInUser._id,
        status:"interested"
       }).populate("fromUserId",USER_SAFE_DATA );
       res.json({
        message:"Data fetched successfully",
        data:connectionRequest,
       });

    }
    catch(err){
        res.status(404).send("ERROR :"+err.message);
    }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    const chats = await Chat.find({
      participants: loggedInUser._id,
    }).select("participants unreadBy");

    const unreadMap = {};
    chats.forEach((chat) => {
      const other = chat.participants.find(
        (id) => id.toString() !== loggedInUser._id.toString()
      );
      if (!other) return;
      unreadMap[other.toString()] =
        chat.unreadBy?.get?.(loggedInUser._id.toString()) || 0;
    });

    res.json({
      data: data.map((user) => {
        const obj = user.toObject ? user.toObject() : user;
        return {
          ...obj,
          unreadCount: unreadMap[obj._id.toString()] || 0,
        };
      }),
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(20, Math.max(1, parseInt(req.query.limit, 10) || 10));
    const skip = (page - 1) * limit;

    const skillFilter = (req.query.interest || req.query.skill || "").trim();
    const genderFilter = (req.query.gender || "").trim().toLowerCase();
    const minAge = parseInt(req.query.minAge, 10);
    const maxAge = parseInt(req.query.maxAge, 10);

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId status");

    const hideUsersFromFeed = new Set([loggedInUser._id.toString()]);

    connectionRequests.forEach((row) => {
      hideUsersFromFeed.add(row.fromUserId.toString());
      hideUsersFromFeed.add(row.toUserId.toString());
    });

    const hideIds = Array.from(hideUsersFromFeed).map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const mySkills = (loggedInUser.skills || [])
      .map((s) => String(s).trim().toLowerCase())
      .filter(Boolean);

    const matchQuery = { _id: { $nin: hideIds } };

    if (["male", "female", "others"].includes(genderFilter)) {
      matchQuery.gender = genderFilter;
    }

    if (Number.isFinite(minAge) || Number.isFinite(maxAge)) {
      matchQuery.age = {};
      if (Number.isFinite(minAge)) matchQuery.age.$gte = minAge;
      if (Number.isFinite(maxAge)) matchQuery.age.$lte = maxAge;
    }

    const skillCount = mySkills.length;
    const normalizedSkillFilter = skillFilter.toLowerCase();

    const [result] = await User.aggregate([
      { $match: matchQuery },
      {
        $addFields: {
          normalizedSkills: {
            $map: {
              input: { $ifNull: ["$skills", []] },
              as: "s",
              in: { $toLower: { $trim: { input: { $toString: "$$s" } } } },
            },
          },
        },
      },
      ...(normalizedSkillFilter
        ? [{ $match: { normalizedSkills: normalizedSkillFilter } }]
        : []),
      {
        $addFields: {
          sharedSkills: { $setIntersection: ["$normalizedSkills", mySkills] },
        },
      },
      {
        $addFields: {
          sharedCount: { $size: "$sharedSkills" },
          matchPercent: {
            $cond: [
              { $eq: [skillCount, 0] },
              0,
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: [{ $size: "$sharedSkills" }, skillCount] },
                      100,
                    ],
                  },
                  0,
                ],
              },
            ],
          },
        },
      },
      { $sort: { matchPercent: -1, sharedCount: -1 } },
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                firstName: 1,
                lastName: 1,
                photoUrl: 1,
                age: 1,
                gender: 1,
                about: 1,
                skills: 1,
                matchPercent: 1,
                sharedSkills: 1,
              },
            },
          ],
        },
      },
    ]);

    const total = result?.metadata?.[0]?.total || 0;
    const data = result?.data || [];

    res.json({
      data,
      page,
      limit,
      total,
      hasMore: skip + data.length < total,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
module.exports = userRouter;