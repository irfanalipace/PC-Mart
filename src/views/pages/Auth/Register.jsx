import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Grid, Typography, InputAdornment } from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import { useDispatch, useSelector } from "react-redux";

// styles
import {
  AuthFooter,
  AuthMainContainer,
  AuthSection,
  FormContainer,
  AuthTitle,
} from "../Auth/Components/Styles";

// import computer from "../../../assets/computer.png";
import FormField from "../../Components/InputField/FormField";
import AuthLogoContainer from "./Components/AuthLogoContainer/AuthLogoContainer";
import { registerApi } from "../../../core/api/auth";

const accountValidationSchema = Yup.object().shape({
  first_name: Yup.string().required("First Name is required"),
  last_name: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(
      /[^a-zA-Z0-9]/,
      "Password must contain at least one special character"
    ),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function Register() {
  const navigate = useNavigate();
  const apiError = useSelector((state) => state?.auth?.apiError);
  const dispatch = useDispatch();
  const [showPass, setShowPass] = useState(false);
  const [continueState, setContinueState] = useState(false);
  // const [company_logo, setcompany_logo] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [loading, setLoading] = useState(false);

  const accountFormik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
    validationSchema: accountValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        console.log(values);
        const resp = await registerApi(values);
        navigate("/login");
      } catch (error) {
        console.log("reg error", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <>
      <AuthMainContainer>
        <Grid container>
          <AuthLogoContainer />
          <Grid container display='flex' justifyContent='center' mt={6}>
            <AuthSection>
              <FormContainer>
                <form onSubmit={accountFormik.handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <AuthTitle variant='h6' component='body1'>
                        Create Your Account
                      </AuthTitle>
                    </Grid>

                    <>
                      <Grid item xs={12}>
                        <FormField
                          type='text'
                          label='First Name'
                          name='first_name'
                          placeholder='First Name'
                          variant='outlined'
                          size='small'
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <PersonIcon />
                              </InputAdornment>
                            ),
                          }}
                          value={accountFormik.values.first_name}
                          isTouched={accountFormik.touched.first_name}
                          error={
                            (accountFormik.touched.first_name &&
                              accountFormik.errors.first_name &&
                              accountFormik.errors.first_name) ||
                            (apiError?.first_name && apiError.first_name)
                          }
                          onBlur={accountFormik.handleBlur}
                          handleChange={accountFormik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormField
                          type='text'
                          label='Last Name'
                          placeholder='Last Name'
                          name='last_name'
                          variant='outlined'
                          size='small'
                          fullWidth
                          isTouched={accountFormik.touched.last_name}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <PersonIcon fontSize='small' />
                              </InputAdornment>
                            ),
                          }}
                          value={accountFormik.values.last_name}
                          error={
                            (accountFormik.touched.last_name &&
                              accountFormik.errors.last_name &&
                              accountFormik.errors.last_name) ||
                            (apiError?.last_name && apiError.last_name)
                          }
                          onBlur={accountFormik.handleBlur}
                          handleChange={accountFormik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <FormField
                          type='email'
                          label='Email Address'
                          variant='outlined'
                          placeholder=' abc@xyz.com'
                          size='small'
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <EmailIcon fontSize='small' />
                              </InputAdornment>
                            ),
                          }}
                          name='email'
                          value={accountFormik.values.email}
                          isTouched={accountFormik.touched.email}
                          error={
                            (accountFormik.touched.email &&
                              accountFormik.errors.email &&
                              accountFormik.errors.email) ||
                            (apiError?.email && apiError.email)
                          }
                          onBlur={accountFormik.handleBlur}
                          handleChange={accountFormik.handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormField
                          type={showPass ? "text" : "password"}
                          label='Password'
                          password
                          placeholder='Password'
                          variant='outlined'
                          size='small'
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <LockIcon fontSize='small' />
                              </InputAdornment>
                            ),
                          }}
                          name='password'
                          value={accountFormik.values.password}
                          isTouched={accountFormik.touched.password}
                          error={
                            (accountFormik.touched.password &&
                              accountFormik.errors.password &&
                              accountFormik.errors.password) ||
                            (apiError?.password && apiError.password)
                          }
                          onBlur={accountFormik.handleBlur}
                          handleChange={accountFormik.handleChange}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <FormField
                          type={showPass ? "text" : "password"}
                          label='Confirm Password'
                          variant='outlined'
                          placeholder=' Confirm Password'
                          size='small'
                          password
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position='start'>
                                <LockIcon fontSize='small' />
                              </InputAdornment>
                            ),
                          }}
                          name='password_confirmation'
                          value={accountFormik.values.password_confirmation}
                          isTouched={
                            accountFormik.touched.password_confirmation
                          }
                          error={
                            (accountFormik.touched.password_confirmation &&
                              accountFormik.errors.password_confirmation &&
                              accountFormik.errors.password_confirmation) ||
                            (apiError?.password_confirmation &&
                              apiError.password_confirmation)
                          }
                          onBlur={accountFormik.handleBlur}
                          handleChange={accountFormik.handleChange}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Typography paddingLeft='4px' variant='body2'>
                          Use 8 or more characters with a mix of letters,
                          numbers & symbols
                        </Typography>
                      </Grid>
                    </>
                  </Grid>

                  <AuthFooter justifyContent>
                    <Button
                      variant='text'
                      to='/login'
                      component={RouterLink}
                      sx={{ textTransform: "capitalize" }}
                    >
                      Sign In
                    </Button>

                    <Button
                      variant='contained'
                      sx={{ textTransform: "capitalize" }}
                      // disabled={loading}
                      type='submit'
                      // loading={companyFormik.isSubmitting}
                    >
                      {loading ? (
                        <CircularProgress size={24} color='inherit' />
                      ) : (
                        "Sign Up"
                      )}
                    </Button>
                  </AuthFooter>
                </form>
              </FormContainer>
            </AuthSection>
            {/* </Grid> */}
          </Grid>
        </Grid>
      </AuthMainContainer>
    </>
  );
}
