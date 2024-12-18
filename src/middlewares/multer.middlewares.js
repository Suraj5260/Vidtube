import multer from "multer";


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/temp')
  },
  filename: function (req, file, cb) {
    // TODO for students
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // change this too 

    //my try
    // const username = req.user.username
    // const fileExtension = this.file.originalname.split('.').pop()
    // const newFilename = `${username}.${fileExtension}`
    cb(null, file.originalname)
  }
})

export const upload = multer({
  storage
})

