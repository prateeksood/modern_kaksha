require('dotenv').config();
const teacherDao = require("../dao/teacher.dao");
const studentDao = require("../dao/student.dao");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const multer = require("multer");
const path = require('path')

const registerTeacherService = async (data, callBack) => {
  const { email, password } = data;
  let hashRounds = 10;
  let tokenExpireTime = 31536000;
  let isMailSent;
  try {
    let foundTeachers = await teacherDao.findTeachersByParameter({ email });
    if (foundTeachers.length === 0) {
      const hashedPassword = await bcrypt.hash(password, hashRounds);
      let OTP = createOTP();
      const hashedOTP = await bcrypt.hash(OTP.toString(), hashRounds);
      data = { ...data, password: hashedPassword, token: hashedOTP };
      let savedTeacher = await teacherDao.saveTeacher(data);
      jwt.sign({ _id: savedTeacher._id }, process.env.JWT_SECRET, { expiresIn: tokenExpireTime }, async (err, token) => {
        if (err) { return callBack(err, 400) }
        savedTeacher.password = undefined;
        let connects = 0;
        savedTeacher.ActiveCreditPurchases.forEach(purchase => {
          if ((new Date(purchase.expiry) - new Date()) > 0) {
            connects += purchase.connects;
          }
        })
        if (connects > 5000000) {
          savedTeacher.connectsLeft = 'Unlimited';
        }
        else {
          savedTeacher.connectsLeft = connects;
        }
        let result = {
          message: "Account successfully created",
          token,
          user: savedTeacher
        }
        isMailSent = await sendEmail(OTP, savedTeacher.email);
        if (isMailSent) {
          return callBack(null, 200, result);
        }
        else {
          return callBack('Unable to send verification email. Please try again later.', 200, result);
        }

      });

    }
    else {
      return callBack('Email Address already in use', 200)
    }
  } catch (err) {
    console.log(err);
    return callBack(err.message, 500)
  }
}

const registerStudentService = async (data, callBack) => {
  const { email, password } = data;
  let hashRounds = 10;
  let tokenExpireTime = 31536000;
  try {
    let foundStudents = await studentDao.findStudentsByParameter({ email });
    if (foundStudents.length === 0) {
      const hashedPassword = await bcrypt.hash(password, hashRounds);
      let OTP = createOTP();
      const hashedOTP = await bcrypt.hash(OTP.toString(), hashRounds);
      data = { ...data, password: hashedPassword, token: hashedOTP }
      let savedStudent = await studentDao.saveStudent(data);
      jwt.sign({ _id: savedStudent._id }, process.env.JWT_SECRET, { expiresIn: tokenExpireTime }, async (err, token) => {
        if (err) { return callBack(err, 400) }
        savedStudent.password = undefined;
        let connects = 0;
        savedStudent.ActiveCreditPurchases.forEach(purchase => {
          if ((new Date(purchase.expiry) - new Date()) > 0) {
            connects += purchase.connects;
          }
        })
        if (connects > 5000000) {
          savedStudent.connectsLeft = 'Unlimited';
        }
        else {
          savedStudent.connectsLeft = connects;
        }
        let result = {
          message: "Account successfully created",
          token,
          user: savedStudent
        }
        isMailSent = await sendEmail(OTP, savedStudent.email);
        if (isMailSent) {
          return callBack(null, 200, result);
        }
        else {
          return callBack('Unable to send verification email. Please try again later.', 200, result);
        }
      });

    }
    else {
      return callBack('Email Address already in use', 200)
    }
  } catch (err) {
    console.log(err);
    return callBack(err.message, 500)
  }
}
const sendVerificationEmail = async (data, callBack) => {
  let isMailSent;
  try {
    let OTP = createOTP();
    let hashRounds = 10;
    const hashedOTP = await bcrypt.hash(OTP.toString(), hashRounds);

    let result = await teacherDao.updateTeacher(data._id, { token: hashedOTP });
    if (result) {
      isMailSent = await sendEmail(OTP, result.email);
      result.password = undefined;
      result.token = undefined;
    }
    else {
      result = await studentDao.updateStudent(data._id, { token: hashedOTP });
      if (result) {
        isMailSent = await sendEmail(OTP, result.email);
        result.password = undefined;
        result.token = undefined;
      }

    }
    if (isMailSent) {
      return callBack(null, 200, result);
    }
    else {
      return callBack('Unable to send verification email. Please try again later.', 200);
    }

  }
  catch (err) {
    console.log(err);
    return callBack(err.message, 500)
  }
}


const createOTP = () => {
  let OTP = Math.floor(100000 + Math.random() * 900000)
  return OTP;
}


const sendEmail = async (otp, email) => {
  try {
    // let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_ID,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: { rejectUnauthorized: false }
    });


    let info = await transporter.sendMail({
      from: '"Modern Kaksha" <support@modernkaksha.com>',
      to: email,
      subject: 'Email Verification',
      html: `<div class="Stage_stageInner__3qmQ4 stageInner"><div class="undefined stageContainer" style="background-color: rgb(248, 248, 249);"><div class="undefined stageContent" style="color: rgb(0, 0, 0); font-family: Montserrat, &quot;Trebuchet MS&quot;, &quot;Lucida Grande&quot;, &quot;Lucida Sans Unicode&quot;, &quot;Lucida Sans&quot;, Tahoma, sans-serif;"><div role="presentation" tabindex="-1" id="10-null-null" class="row-container-outer StageRow_row__3D1iS StageRow_first__3gnZ6           Bee_showStructureRow__3kLAE" style="background-color: rgb(40, 118, 160); background-image: none; background-position: left top; background-repeat: no-repeat; text-align: center;"><div class="row-container StageRow_rowContainerInner__YbiK1"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="row-selector StageRow_rowSelector__353d5" data-name="Row"></div>
            <div class="row-content StageRow_rowContent__3QqQw" style="background-color: rgb(40, 118, 160); background-image: none; background-position: left top; background-repeat: no-repeat; color: rgb(0, 0, 0); width: 640px; max-width: 640px; margin: auto;"><div class="Bee_showStructureCol__1bw7M stage__column StageColumn_column__Hupyb   StageColumn_col-md-12__Gyg8O index_col-12__3CH45 index_md-col-12__1fWRF"><div role="presentation" tabindex="-1" style="outline: none;"><div class="columnOuter undefined" style="background-color: transparent; border-width: 0px; border-style: solid; border-color: transparent; padding: 0px;"><div class="columns undefined"><div class="columns undefined"><div role="presentation" tabindex="-1" id="10-0-0" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8   module-box--divider"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div class=" StageModuleDivider_wrapper__34Pbr"><div style="padding: 0px; line-height: 0; text-align: center;"><div style="display: inline-block; border-top: 4px solid rgb(40, 118, 160); width: 100%;"></div></div></div></div></div></div></div></div></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="20-null-null" class="row-container-outer StageRow_row__3D1iS            Bee_showStructureRow__3kLAE" style="background-color: transparent; background-image: none; background-position: left top; background-repeat: no-repeat; text-align: center;"><div class="row-container StageRow_rowContainerInner__YbiK1"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="row-selector StageRow_rowSelector__353d5" data-name="Row"></div><div class="row-content StageRow_rowContent__3QqQw" style="background-color: rgb(255, 255, 255); background-image: none; background-position: left top; background-repeat: no-repeat; color: rgb(0, 0, 0); width: 640px; max-width: 640px; margin: auto;"><div class="Bee_showStructureCol__1bw7M stage__column StageColumn_column__Hupyb   StageColumn_col-md-12__Gyg8O index_col-12__3CH45 index_md-col-12__1fWRF"><div role="presentation" tabindex="-1" style="outline: none;"><div class="columnOuter undefined" style="background-color: transparent; border-width: 0px; border-style: solid; border-color: transparent; padding: 0px;"><div class="columns undefined"><div class="columns undefined"><div role="presentation" tabindex="-1" id="20-0-0" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8   module-box--image"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div class="center fixedwidth"><div class="image-wrap     StageModuleImage_sidebarModule__175-l" style="width: 100%; padding: 0px 40px;"><div class="StageModuleImage_uploaderDropZone__Va43T  "><img width="352" src="https://modernkaksha.com/api/uploads/logo.PNG" alt="I'm an image"></div></div><div class="StageModuleImage_clickableLayer__xiNlN"></div></div></div></div></div><div role="presentation" tabindex="-1" id="20-0-1" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8   module-box--divider"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div class=" StageModuleDivider_wrapper__34Pbr"><div style="padding: 50px 0px 0px; line-height: 0; text-align: center;"><div style="display: inline-block; border-top: 0px solid rgb(187, 187, 187); width: 100%;"></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="20-0-2" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8 StageColumn_moduleWrapper--text__1yX_x  module-box--text"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div><div role="presentation" class="textwrapper textwrapper_item_987a1fbd-ed8b-4846-918d-48cb664c5b98_4f78f97c-28a5-4c6f-adad-9a3809a5e229_f87b1a07-8b88-4113-ad7f-22f6f48efc9c  undefined StageModuleText_stageModuleText__1IDuN editor-first undefined textmodule--firstcolumn StageModuleText_firstColumn__3iFWC " style="padding: 10px 40px; color: rgb(85, 85, 85); font-family: inherit; overflow-wrap: break-word;"><div class="editor-outer    StageModuleText_wrapper__3kHNI item_987a1fbd-ed8b-4846-918d-48cb664c5b98_4f78f97c-28a5-4c6f-adad-9a3809a5e229_f87b1a07-8b88-4113-ad7f-22f6f48efc9c"><style>.item_987a1fbd-ed8b-4846-918d-48cb664c5b98_4f78f97c-28a5-4c6f-adad-9a3809a5e229_f87b1a07-8b88-4113-ad7f-22f6f48efc9c a { 
                color: #000000 
              }.editor_item_987a1fbd-ed8b-4846-918d-48cb664c5b98_4f78f97c-28a5-4c6f-adad-9a3809a5e229_f87b1a07-8b88-4113-ad7f-22f6f48efc9c * { line-height: 1.2 !important }</style><div class="editor-wrapper editorwrapper_text editor_item_987a1fbd-ed8b-4846-918d-48cb664c5b98_4f78f97c-28a5-4c6f-adad-9a3809a5e229_f87b1a07-8b88-4113-ad7f-22f6f48efc9c StageModuleText_editorWrapper__19Z6l"><div id="mce_21fc15b9_28b7-45cc-b370-ff67152e5b8d" tabindex="-1" class="mce-content-body" contenteditable="true" style="position: relative;"><div class="txtTinyMce-wrapper" style="line-height: 14px; font-size: 12px;" data-mce-style="line-height: 14px; font-size: 12px;"><p style="font-size: 16px; line-height: 19px; text-align: center; word-break: break-word;" data-mce-style="font-size: 16px; line-height: 19px; text-align: center; word-break: break-word;"><span style="font-size: 30px; color: #2b303a; line-height: 36px;" data-mce-style="font-size: 30px; color: #2b303a; line-height: 36px;"><strong>Welcome!</strong></span></p></div></div></div></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="20-0-3" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8 StageColumn_moduleWrapper--text__1yX_x  module-box--text"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div><div role="presentation" class="textwrapper textwrapper_item_987a1fbd-ed8b-4846-918d-48cb664c5b98_4f78f97c-28a5-4c6f-adad-9a3809a5e229_8b16b7c2-8183-4fe5-b78a-8296982f922b  undefined StageModuleText_stageModuleText__1IDuN editor-first undefined textmodule--firstcolumn StageModuleText_firstColumn__3iFWC " style="padding: 10px 40px; color: rgb(85, 85, 85); font-family: inherit; overflow-wrap: break-word;"><div class="editor-outer    StageModuleText_wrapper__3kHNI item_987a1fbd-ed8b-4846-918d-48cb664c5b98_4f78f97c-28a5-4c6f-adad-9a3809a5e229_8b16b7c2-8183-4fe5-b78a-8296982f922b"><style>.item_987a1fbd-ed8b-4846-918d-48cb664c5b98_4f78f97c-28a5-4c6f-adad-9a3809a5e229_8b16b7c2-8183-4fe5-b78a-8296982f922b a { 
                color: #000000 
              }.editor_item_987a1fbd-ed8b-4846-918d-48cb664c5b98_4f78f97c-28a5-4c6f-adad-9a3809a5e229_8b16b7c2-8183-4fe5-b78a-8296982f922b * { line-height: 1.5 !important }</style><div class="editor-wrapper editorwrapper_text editor_item_987a1fbd-ed8b-4846-918d-48cb664c5b98_4f78f97c-28a5-4c6f-adad-9a3809a5e229_8b16b7c2-8183-4fe5-b78a-8296982f922b StageModuleText_editorWrapper__19Z6l"><div id="mce_0e592e2c_18ce-43e3-924c-28c9dea18216" tabindex="-1" class="mce-content-body" contenteditable="true" style="position: relative;"><div class="txtTinyMce-wrapper" style="line-height: 18px; font-size: 12px; font-family: inherit;" data-mce-style="line-height: 18px; font-size: 12px; font-family: inherit;"><p style="font-size: 14px; line-height: 21px; text-align: center; word-break: break-word; font-family: inherit;" data-mce-style="font-size: 14px; line-height: 21px; text-align: center; word-break: break-word;">We are excited to have you get started. First, you need to confirm your account. Just enter the following OTP to confirm your account.</p></div></div></div></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="20-0-4" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8   module-box--divider"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div class=" StageModuleDivider_wrapper__34Pbr"><div style="padding: 50px 0px 0px; line-height: 0; text-align: center;"><div style="display: inline-block; border-top: 0px solid rgb(187, 187, 187); width: 100%;"></div></div></div></div></div></div></div></div></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="30-null-null" class="row-container-outer StageRow_row__3D1iS            Bee_showStructureRow__3kLAE" style="background-color: transparent; background-image: none; background-position: left top; background-repeat: no-repeat; text-align: center;"><div class="row-container StageRow_rowContainerInner__YbiK1"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="row-selector StageRow_rowSelector__353d5" data-name="Row"></div><div class="row-content StageRow_rowContent__3QqQw" style="background-color: rgb(243, 250, 250); background-image: none; background-position: left top; background-repeat: no-repeat; color: rgb(0, 0, 0); width: 640px; max-width: 640px; margin: auto;"><div class="Bee_showStructureCol__1bw7M stage__column StageColumn_column__Hupyb   StageColumn_col-md-12__Gyg8O index_col-12__3CH45 index_md-col-12__1fWRF"><div role="presentation" tabindex="-1" style="outline: none;"><div class="columnOuter undefined" style="background-color: transparent; border-width: 0px 30px; border-style: solid; border-color: transparent rgb(255, 255, 255); padding: 0px;"><div class="columns undefined"><div class="columns undefined"><div role="presentation" tabindex="-1" id="30-0-0" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8   module-box--divider"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div class=" StageModuleDivider_wrapper__34Pbr"><div style="padding: 0px; line-height: 0; text-align: center;"><div style="display: inline-block; border-top: 4px solid rgb(40, 118, 160); width: 100%;"></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="30-0-1" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8   module-box--divider"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div class=" StageModuleDivider_wrapper__34Pbr"><div style="padding: 25px 0px 0px; line-height: 0; text-align: center;"><div style="display: inline-block; border-top: 0px solid rgb(187, 187, 187); width: 100%;"></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="30-0-2" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8 StageColumn_moduleWrapper--text__1yX_x  module-box--text"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div><div role="presentation" class="textwrapper textwrapper_item_f93dd37c-5ab8-4e92-995b-87d186e333b9_fb95cc6e-970c-4e68-b124-e7eeba85dfb2_e26ab8e3-7400-459d-802c-ff6844f1934b  undefined StageModuleText_stageModuleText__1IDuN editor-first undefined textmodule--firstcolumn StageModuleText_firstColumn__3iFWC " style="padding: 10px 10px 5px; color: rgb(85, 85, 85); font-family: inherit; overflow-wrap: break-word;"><div class="editor-outer    StageModuleText_wrapper__3kHNI item_f93dd37c-5ab8-4e92-995b-87d186e333b9_fb95cc6e-970c-4e68-b124-e7eeba85dfb2_e26ab8e3-7400-459d-802c-ff6844f1934b"><style>.item_f93dd37c-5ab8-4e92-995b-87d186e333b9_fb95cc6e-970c-4e68-b124-e7eeba85dfb2_e26ab8e3-7400-459d-802c-ff6844f1934b a { 
                color: #000000 
              }.editor_item_f93dd37c-5ab8-4e92-995b-87d186e333b9_fb95cc6e-970c-4e68-b124-e7eeba85dfb2_e26ab8e3-7400-459d-802c-ff6844f1934b * { line-height: 1.2 !important }</style><div class="editor-wrapper editorwrapper_text editor_item_f93dd37c-5ab8-4e92-995b-87d186e333b9_fb95cc6e-970c-4e68-b124-e7eeba85dfb2_e26ab8e3-7400-459d-802c-ff6844f1934b StageModuleText_editorWrapper__19Z6l"><div id="mce_98402b78_934e-4b8c-9af1-e78eaa7d31a9" tabindex="-1" class="mce-content-body" contenteditable="true" style="position: relative;"><div class="txtTinyMce-wrapper" style="line-height: 14px; font-size: 12px;" data-mce-style="line-height: 14px; font-size: 12px;"><p style="font-size: 16px; line-height: 19px; text-align: center; word-break: break-word;" data-mce-style="font-size: 16px; line-height: 19px; text-align: center; word-break: break-word;"><span style="color: #2b303a; font-size: 18px; line-height: 21px;" data-mce-style="color: #2b303a; font-size: 18px; line-height: 21px;"><strong>Use this OTP</strong></span></p></div></div></div></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="30-0-3" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8 StageColumn_moduleWrapper--text__1yX_x  module-box--text"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div><div role="presentation" class="textwrapper textwrapper_item_f93dd37c-5ab8-4e92-995b-87d186e333b9_fb95cc6e-970c-4e68-b124-e7eeba85dfb2_c14937a2-1289-4aea-8ad5-7a4265c75c2e  undefined StageModuleText_stageModuleText__1IDuN editor-first undefined textmodule--firstcolumn StageModuleText_firstColumn__3iFWC " style="padding: 0px 0px 32px; color: rgb(85, 85, 85); font-family: inherit; overflow-wrap: break-word;"><div class="editor-outer    StageModuleText_wrapper__3kHNI item_f93dd37c-5ab8-4e92-995b-87d186e333b9_fb95cc6e-970c-4e68-b124-e7eeba85dfb2_c14937a2-1289-4aea-8ad5-7a4265c75c2e"><style>.item_f93dd37c-5ab8-4e92-995b-87d186e333b9_fb95cc6e-970c-4e68-b124-e7eeba85dfb2_c14937a2-1289-4aea-8ad5-7a4265c75c2e a { 
                color: #000000 
              }.editor_item_f93dd37c-5ab8-4e92-995b-87d186e333b9_fb95cc6e-970c-4e68-b124-e7eeba85dfb2_c14937a2-1289-4aea-8ad5-7a4265c75c2e * { line-height: 1.2 !important }</style><div class="editor-wrapper editorwrapper_text editor_item_f93dd37c-5ab8-4e92-995b-87d186e333b9_fb95cc6e-970c-4e68-b124-e7eeba85dfb2_c14937a2-1289-4aea-8ad5-7a4265c75c2e StageModuleText_editorWrapper__19Z6l"><div id="mce_476a2b08_8a38-4b34-b057-8ba13e0f34e4" tabindex="-1" class="mce-content-body" contenteditable="true" style="position: relative;"><div class="txtTinyMce-wrapper" style="line-height: 14px; font-size: 12px;" data-mce-style="line-height: 14px; font-size: 12px;"><p style="font-size: 16px; line-height: 19px; text-align: center; word-break: break-word;" data-mce-style="font-size: 16px; line-height: 19px; text-align: center; word-break: break-word;"><span style="color: #1aa19c; font-size: 38px; line-height: 45px;" data-mce-style="color: #1aa19c; font-size: 38px; line-height: 45px;"><span style="line-height: 14px;" data-mce-style="line-height: 14px;"><strong>${otp}</strong></span></span></p></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="40-null-null" class="row-container-outer StageRow_row__3D1iS            Bee_showStructureRow__3kLAE" style="background-color: transparent; background-image: none; background-position: left top; background-repeat: no-repeat; text-align: center;"><div class="row-container StageRow_rowContainerInner__YbiK1"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="row-selector StageRow_rowSelector__353d5" data-name="Row"></div><div class="row-content StageRow_rowContent__3QqQw" style="background-color: rgb(255, 255, 255); background-image: none; background-position: left top; background-repeat: no-repeat; color: rgb(0, 0, 0); width: 640px; max-width: 640px; margin: auto;"><div class="Bee_showStructureCol__1bw7M stage__column StageColumn_column__Hupyb   StageColumn_col-md-12__Gyg8O index_col-12__3CH45 index_md-col-12__1fWRF"><div role="presentation" tabindex="-1" style="outline: none;"><div class="columnOuter undefined" style="background-color: transparent; border-width: 0px; border-style: solid; border-color: transparent; padding: 0px;"><div class="columns undefined"><div class="columns undefined"><div role="presentation" tabindex="-1" id="40-0-0" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8   module-box--divider"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div class=" StageModuleDivider_wrapper__34Pbr"><div style="padding: 60px 0px 12px; line-height: 0; text-align: center;"><div style="display: inline-block; border-top: 0px solid rgb(187, 187, 187); width: 100%;"></div></div></div></div></div></div></div></div></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="50-null-null" class="row-container-outer StageRow_row__3D1iS            Bee_showStructureRow__3kLAE" style="background-color: transparent; background-image: none; background-position: left top; background-repeat: no-repeat; text-align: center;"><div class="row-container StageRow_rowContainerInner__YbiK1"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="row-selector StageRow_rowSelector__353d5" data-name="Row"></div><div class="row-content StageRow_rowContent__3QqQw" style="background-color: rgb(248, 248, 249); background-image: none; background-position: left top; background-repeat: no-repeat; color: rgb(0, 0, 0); width: 640px; max-width: 640px; margin: auto;"><div class="Bee_showStructureCol__1bw7M stage__column StageColumn_column__Hupyb   StageColumn_col-md-12__Gyg8O index_col-12__3CH45 index_md-col-12__1fWRF"><div role="presentation" tabindex="-1" style="outline: none;"><div class="columnOuter undefined" style="background-color: transparent; border-width: 0px; border-style: solid; border-color: transparent; padding: 5px 0px;"><div class="columns undefined"><div class="columns undefined"><div role="presentation" tabindex="-1" id="50-0-0" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8   module-box--divider"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div class=" StageModuleDivider_wrapper__34Pbr"><div style="padding: 20px; line-height: 0; text-align: center;"><div style="display: inline-block; border-top: 0px solid rgb(187, 187, 187); width: 100%;"></div></div></div></div></div></div></div></div></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="60-null-null" class="row-container-outer StageRow_row__3D1iS            Bee_showStructureRow__3kLAE" style="background-color: transparent; background-image: none; background-position: left top; background-repeat: no-repeat; text-align: center;"><div class="row-container StageRow_rowContainerInner__YbiK1"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="row-selector StageRow_rowSelector__353d5" data-name="Row"></div><div class="row-content StageRow_rowContent__3QqQw" style="background-color: rgb(43, 48, 58); background-image: none; background-position: left top; background-repeat: no-repeat; color: rgb(0, 0, 0); width: 640px; max-width: 640px; margin: auto;"><div class="Bee_showStructureCol__1bw7M stage__column StageColumn_column__Hupyb   StageColumn_col-md-12__Gyg8O index_col-12__3CH45 index_md-col-12__1fWRF"><div role="presentation" tabindex="-1" style="outline: none;"><div class="columnOuter undefined" style="background-color: transparent; border-width: 0px; border-style: solid; border-color: transparent; padding: 0px;"><div class="columns undefined"><div class="columns undefined"><div role="presentation" tabindex="-1" id="60-0-0" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8   module-box--divider"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div class=" StageModuleDivider_wrapper__34Pbr"><div style="padding: 0px; line-height: 0; text-align: center;"><div style="display: inline-block; border-top: 4px solid rgb(26, 161, 156); width: 100%;"></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="60-0-1" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8   module-box--image"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div class="center autowidth"><div class="image-wrap     StageModuleImage_sidebarModule__175-l" style="width: 100%; padding: 0px;"><div class="StageModuleImage_uploaderDropZone__Va43T  "><img width="640" src="https://d1oco4z2z1fhwp.cloudfront.net/templates/default/1361/footer.png" alt="I'm an image"></div></div><div class="StageModuleImage_clickableLayer__xiNlN"></div></div></div></div></div><div role="presentation" tabindex="-1" id="60-0-2" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8 StageColumn_moduleWrapper--text__1yX_x  module-box--text"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div><div role="presentation" class="textwrapper textwrapper_item_a1d841c2-0643-40e8-9556-32f7f205c884_4f78f97c-28a5-4c6f-adad-9a3809a5e229_c430c9d5-2702-4ec7-b9f2-e8af742a74e7  undefined StageModuleText_stageModuleText__1IDuN editor-first undefined textmodule--firstcolumn StageModuleText_firstColumn__3iFWC " style="padding: 15px 40px 10px; color: rgb(85, 85, 85); font-family: inherit; overflow-wrap: break-word;"><div class="editor-outer    StageModuleText_wrapper__3kHNI item_a1d841c2-0643-40e8-9556-32f7f205c884_4f78f97c-28a5-4c6f-adad-9a3809a5e229_c430c9d5-2702-4ec7-b9f2-e8af742a74e7"><style>.item_a1d841c2-0643-40e8-9556-32f7f205c884_4f78f97c-28a5-4c6f-adad-9a3809a5e229_c430c9d5-2702-4ec7-b9f2-e8af742a74e7 a { 
                color: #000000 
              }.editor_item_a1d841c2-0643-40e8-9556-32f7f205c884_4f78f97c-28a5-4c6f-adad-9a3809a5e229_c430c9d5-2702-4ec7-b9f2-e8af742a74e7 * { line-height: 1.5 !important }</style><div class="editor-wrapper editorwrapper_text editor_item_a1d841c2-0643-40e8-9556-32f7f205c884_4f78f97c-28a5-4c6f-adad-9a3809a5e229_c430c9d5-2702-4ec7-b9f2-e8af742a74e7 StageModuleText_editorWrapper__19Z6l"><div id="mce_e574a560_4246-4fdc-bd69-194a74c5b0ad" tabindex="-1" class="mce-content-body" contenteditable="true" style="position: relative;"><div class="txtTinyMce-wrapper" style="line-height: 18px; font-size: 12px; font-family: inherit;" data-mce-style="line-height: 18px; font-size: 12px; font-family: inherit;"><p style="font-size: 14px; line-height: 21px; word-break: break-word; text-align: left; font-family: inherit;" data-mce-style="font-size: 14px; line-height: 21px; word-break: break-word; text-align: left;"><span style="color: #95979c; line-height: 18px; font-size: 12px;" data-mce-style="color: #95979c; line-height: 18px; font-size: 12px;">If you have any queries, feel free to reply to this email. We are always here to help you.</span></p></div></div></div></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="60-0-3" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8   module-box--divider"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div class=" StageModuleDivider_wrapper__34Pbr"><div style="padding: 25px 40px 10px; line-height: 0; text-align: center;"><div style="display: inline-block; border-top: 1px solid rgb(85, 89, 97); width: 100%;"></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="60-0-4" data-name="Content" class="drop-target module-box       StageColumn_moduleWrapper__2zIu8 StageColumn_moduleWrapper--text__1yX_x  module-box--text"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a>
              <div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div><div role="presentation" class="textwrapper textwrapper_item_a1d841c2-0643-40e8-9556-32f7f205c884_4f78f97c-28a5-4c6f-adad-9a3809a5e229_de782396-dba2-44b3-8e97-23eb48623293  undefined StageModuleText_stageModuleText__1IDuN editor-first undefined textmodule--firstcolumn StageModuleText_firstColumn__3iFWC " style="padding: 20px 40px 30px; color: rgb(85, 85, 85); font-family: inherit; overflow-wrap: break-word;"><div class="editor-outer    StageModuleText_wrapper__3kHNI item_a1d841c2-0643-40e8-9556-32f7f205c884_4f78f97c-28a5-4c6f-adad-9a3809a5e229_de782396-dba2-44b3-8e97-23eb48623293"><style>.item_a1d841c2-0643-40e8-9556-32f7f205c884_4f78f97c-28a5-4c6f-adad-9a3809a5e229_de782396-dba2-44b3-8e97-23eb48623293 a { 
                color: #000000 
              }.editor_item_a1d841c2-0643-40e8-9556-32f7f205c884_4f78f97c-28a5-4c6f-adad-9a3809a5e229_de782396-dba2-44b3-8e97-23eb48623293 * { line-height: 1.2 !important }</style><div class="editor-wrapper editorwrapper_text editor_item_a1d841c2-0643-40e8-9556-32f7f205c884_4f78f97c-28a5-4c6f-adad-9a3809a5e229_de782396-dba2-44b3-8e97-23eb48623293 StageModuleText_editorWrapper__19Z6l"><div id="mce_dfc1c79c_9ad1-44a7-ad10-38737149dabd" tabindex="-1" class="mce-content-body" contenteditable="true" style="position: relative;"><div class="txtTinyMce-wrapper" style="line-height: 14px; font-size: 12px; font-family: inherit;" data-mce-style="line-height: 14px; font-size: 12px; font-family: inherit;"><p style="font-size: 14px; line-height: 16px; word-break: break-word; text-align: center; font-family: inherit;" data-mce-style="font-size: 14px; line-height: 16px; word-break: break-word; text-align: center;"><span style="color: #95979c; line-height: 14px; font-size: 12px;" data-mce-style="color: #95979c; line-height: 14px; font-size: 12px;">Modern Kaksha Copyright © 2020</span></p></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div><div role="presentation" tabindex="-1" id="70-null-null" class="row-container-outer StageRow_row__3D1iS     StageRow_locked__NWWfN row-container-outer--locked       Bee_showStructureRow__3kLAE" style="background-color: transparent; background-image: none; background-position: left top; background-repeat: no-repeat; text-align: center;"><div class="row-container StageRow_rowContainerInner__YbiK1"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="row-selector StageRow_rowSelector__353d5" data-name="Row"></div><div class="row-content StageRow_rowContent__3QqQw" style="background-color: transparent; background-image: none; background-position: left top; background-repeat: no-repeat; color: rgb(0, 0, 0); width: 640px; max-width: 640px; margin: auto;"><div class="Bee_showStructureCol__1bw7M stage__column StageColumn_column__Hupyb   StageColumn_col-md-6__2wc8n index_col-12__3CH45 index_md-col-6__2EDMh"><div role="presentation" tabindex="-1" style="outline: none;"><div class="columnOuter undefined" style="background-color: transparent; border-width: 0px; border-style: solid; border-color: transparent; padding: 10px 0px;"><div class="columns undefined"><div class="columns undefined"><div role="presentation" tabindex="-1" id="70-0-0" data-name="Content" class="drop-target module-box  StageColumn_lastRow__3M24B    StageColumn_locked__3ciRC module-box--locked StageColumn_moduleWrapper__2zIu8   module-box--image"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div class="right fixedwidth"><div class="image-wrap     StageModuleImage_sidebarModule__175-l" style="width: 100%; padding: 0px 5px 0px 0px;">
              </div></div></div></div></div></div></div></div></div><div class="Bee_showStructureCol__1bw7M stage__column StageColumn_column__Hupyb   StageColumn_col-md-6__2wc8n index_col-12__3CH45 index_md-col-6__2EDMh"><div role="presentation" tabindex="-1" style="outline: none;"><div class="columnOuter undefined" style="background-color: transparent; border-width: 0px; border-style: solid; border-color: transparent; padding: 10px 0px;"><div class="columns undefined"><div class="columns undefined"><div role="presentation" tabindex="-1" id="70-1-0" data-name="Content" class="drop-target module-box  StageColumn_lastRow__3M24B    StageColumn_locked__3ciRC module-box--locked StageColumn_moduleWrapper__2zIu8 StageColumn_moduleWrapper--text__1yX_x  module-box--text"><a class="CommentBadge_badgeLink__1lsoT" role="presentation"></a><div class="StageColumn_locked__3ciRC"><div class="content-labels content-labels--cs StageColumn_contentLabels__3bydF"><div class="hidden-content-label hidden-content-label--cs"></div><div><div role="presentation" class="textwrapper textwrapper_item_09b6e09f-c1a6-4627-ae8a-da4d8698d9a4_343a3487-de62-4cba-8433-37eeee6c2758_6125ce82-5d3a-4c6c-b781-4af89e43a9d5  undefined StageModuleText_stageModuleText__1IDuN editor-first undefined  " style="padding: 4px; color: rgb(157, 157, 157); font-family: Lato, Tahoma, Verdana, Segoe, sans-serif; overflow-wrap: break-word;"><div class="editor-outer   StageModuleText_readOnly__1NXkf StageModuleText_wrapper__3kHNI item_09b6e09f-c1a6-4627-ae8a-da4d8698d9a4_343a3487-de62-4cba-8433-37eeee6c2758_6125ce82-5d3a-4c6c-b781-4af89e43a9d5"><style>.item_09b6e09f-c1a6-4627-ae8a-da4d8698d9a4_343a3487-de62-4cba-8433-37eeee6c2758_6125ce82-5d3a-4c6c-b781-4af89e43a9d5 a { 
                color: #9d9d9d 
              }.editor_item_09b6e09f-c1a6-4627-ae8a-da4d8698d9a4_343a3487-de62-4cba-8433-37eeee6c2758_6125ce82-5d3a-4c6c-b781-4af89e43a9d5 * { line-height: 1.2 !important }</style><div class="editor-wrapper editor_item_09b6e09f-c1a6-4627-ae8a-da4d8698d9a4_343a3487-de62-4cba-8433-37eeee6c2758_6125ce82-5d3a-4c6c-b781-4af89e43a9d5 StageModuleText_editorWrapper__19Z6l StageModuleText_editorWrapper__19Z6l"><div class="  StageModuleText_readOnly__1NXkf"><div class="txtTinyMce-wrapper" style="line-height: 14px; font-size: 12px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;" data-mce-style="line-height: 14px; font-size: 12px; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;"><p style="font-size: 14px; line-height: 16px; word-break: break-word; font-family: Lato, Tahoma, Verdana, Segoe, sans-serif;" data-mce-style="font-size: 14px; line-height: 16px; word-break: break-word;"></span></a></p></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div></div>         
                `
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    return true;
  }
  catch (err) {
    console.log(err);
    return false;
  }
}
module.exports = { registerTeacherService, registerStudentService, sendVerificationEmail };