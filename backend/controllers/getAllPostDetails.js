const usersPost = require("../model/postTable");


exports.usersPosts = async (req, res) => {
  let count = await usersPost.count();
  let { page, limit } = req.query 
  
  await usersPost.aggregate([

    {
      $lookup:
      {
        from: "userdetails",
        localField: "UserId",
        foreignField: "_id",
        as: "WhoCreated",

      }, 

    },

    {
      $lookup: {
        from: "usercomments",
        localField: "_id",
        foreignField: "PostId",
        as: "comments",
      },
    },

    {
      $lookup: {
        from: "liketabs",
        localField: "_id",
        foreignField: "PostId",
        as: "likes"
      },
    },

  ])
    .skip((page - 1) * limit).limit(limit * 1)
    .exec((err, result) => {
      if (err) {
        return res.send("data is not there");
      }
      else {
        // console.log(result)
        return res.status(200).send({
          data: result,
          postCount: count
        });
      };
    });
};