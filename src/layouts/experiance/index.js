import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { Alert } from "@mui/material";

function Experience() {
  const [image, setImage] = useState({ url: "", public_id: "" });
  const [experiences, setExperiences] = useState([]);
  const validationSchema = Yup.object({
    happyClients: Yup.number().required("Required").min(0, "Must be a positive number"),
    projects: Yup.number().required("Required").min(0, "Must be a positive number"),
    hardWorkers: Yup.number().required("Required").min(0, "Must be a positive number"),
    hoursSpent: Yup.number().required("Required").min(0, "Must be a positive number"),
  });

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get("https://editsh-back-anft.onrender.com/api/experince/view");
      setExperiences(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch testimonials");
    }
  };

  const handleDeleteTestimonial = async (id) => {
    try {
      const response = await axios.delete(
        `https://editsh-back-anft.onrender.com/api/experince/${id}`
      );
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchTestimonials();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete testimonial");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Formik
              initialValues={{
                happyClients: "",
                projects: "",
                hardWorkers: "",
                hoursSpent: "",
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const response = await axios.post(
                    "https://editsh-back-anft.onrender.com/api/experince/add",
                    values
                  );
                  console.log(response);
                  toast.success(response.data.message);
                  navigate("/Experience");
                } catch (error) {
                  console.error("Error submitting form:", error);
                  toast.error(error.response.data.message);
                } finally {
                  setSubmitting(false);
                  resetForm();
                }
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <Grid item xs={12}>
                    <Field
                      name="happyClients"
                      as={TextField}
                      label="Happy Clients"
                      fullWidth
                      size="small"
                      margin="normal"
                      variant="filled"
                      type="number"
                      helperText={touched.happyClients && errors.happyClients}
                      error={touched.happyClients && Boolean(errors.happyClients)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="projects"
                      as={TextField}
                      label="Projects"
                      size="small"
                      fullWidth
                      margin="normal"
                      variant="filled"
                      type="number"
                      helperText={touched.projects && errors.projects}
                      error={touched.projects && Boolean(errors.projects)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="hardWorkers"
                      as={TextField}
                      label="Hard Workers"
                      fullWidth
                      size="small"
                      margin="normal"
                      variant="filled"
                      type="number"
                      helperText={touched.hardWorkers && errors.hardWorkers}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Field
                      name="hoursSpent"
                      as={TextField}
                      label="Hours Spent"
                      fullWidth
                      size="small"
                      margin="normal"
                      variant="filled"
                      type="number"
                      helperText={touched.hoursSpent && errors.hoursSpent}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MDButton type="submit" ariant="text" color="info" variant="contained">
                      Send
                    </MDButton>
                  </Grid>
                </Form>
              )}
            </Formik>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {experiences.length > 0 ? (
                experiences.map((experience) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={experience._id}>
                    <Card>
                      <MDBox
                        p={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        textAlign="center"
                      >
                        <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                          Happy Clients-{experience.happyClients}
                        </MDTypography>
                        <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                          Hard Workers-{experience.hardWorkers}
                        </MDTypography>
                        <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                          Hours Spent-{experience.hoursSpent}
                        </MDTypography>
                        <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                          Projects-{experience.projects}
                        </MDTypography>
                        <MDButton
                          variant="text"
                          color="error"
                          onClick={() => handleDeleteTestimonial(experience._id)}
                          startIcon={<Icon>delete</Icon>}
                          sx={{ mt: 2 }}
                        >
                          Delete
                        </MDButton>
                      </MDBox>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Alert severity="error" fullwidth>
                  No Experience available.
                </Alert>
              )}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Experience;
