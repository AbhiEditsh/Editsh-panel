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
import { Box } from "@mui/material";

function Clients() {
  const [image, setImage] = useState({ url: "", public_id: "" });
  const [clients, setClients] = useState([]);

  const validationSchema = Yup.object({
    companyName: Yup.string().required("Company Name is required"),
    logoImage: Yup.string().url("Invalid URL format").required("Logo Image URL is required"),
  });

  const handleFileChange = async (event, setFieldValue) => {
    const file = event.target.files[0];

    if (file && file.size > 1024 * 1024 * 10) {
      toast.error("File is too large. Please select a file smaller than 10MB.");
      return;
    }

    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      try {
        const response = await axios.post(
          "https://editsh-back.onrender.com/api/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setImage({
          url: response.data.url,
          public_id: response.data.public_id,
        });
        setFieldValue("logoImage", response.data.url);
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Error uploading image. Please try again.");
      }
    }
  };

  const fetchTestimonials = async () => {
    try {
      const response = await axios.get("https://editsh-back.onrender.com/api/clients/view");
      setClients(response.data.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch testimonials");
    }
  };

  const handleDeleteTestimonial = async (id) => {
    try {
      const response = await axios.delete(`https://editsh-back.onrender.com/api/clients/${id}`);
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
              initialValues={{ companyName: "", logoImage: "" }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                try {
                  const response = await axios.post(
                    "https://editsh-back.onrender.com/api/clients/add",
                    values
                  );
                  toast.success(response.data.message);
                  resetForm();
                  navigate("/client");
                } catch (error) {
                  console.error("Error submitting form data:", error);
                  toast.error(error.response.data.message || "Failed to submit form");
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ errors, touched, isSubmitting, setFieldValue }) => (
                <Form>
                  <Box display="flex" flexDirection="column" gap={2} alignItems="center">
                    {/* Form Fields */}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setFieldValue)}
                      id="file-input"
                      style={{ display: "none" }}
                    />
                    <Avatar
                      alt="Client Image"
                      src={image.url}
                      onClick={() => document.getElementById("file-input").click()}
                      sx={{
                        cursor: "pointer",
                        width: 96,
                        height: 96,
                      }}
                    />
                    {errors.ClientImage && touched.ClientImage && (
                      <MDTypography color="error" variant="caption">
                        {errors.ClientImage}
                      </MDTypography>
                    )}
                    <Field
                      name="companyName"
                      as={TextField}
                      label="Company Name"
                      size="small"
                      variant="filled"
                      error={touched.companyName && !!errors.companyName}
                      helperText={touched.companyName && errors.companyName}
                    />
                    <MDButton type="submit" ariant="text" color="info" disabled={isSubmitting}>
                      Submit
                    </MDButton>
                  </Box>
                </Form>
              )}
            </Formik>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {clients.length > 0 ? (
                clients.map((client) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={client._id}>
                    <Card>
                      <MDBox
                        p={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        textAlign="center"
                      >
                        <Avatar
                          alt={client?.companyName}
                          src={client.logoImage}
                          sx={{ width: 80, height: 80, mb: 2 }}
                        />
                        <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                          {client.companyName}
                        </MDTypography>
                        <MDButton
                          variant="text"
                          color="error"
                          onClick={() => handleDeleteTestimonial(client._id)}
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
                <MDTypography variant="h6" textAlign="center" width="100%">
                  No Clients available.
                </MDTypography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Clients;
