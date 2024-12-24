import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import TextField from "@mui/material/TextField";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDButtonRoot from "components/MDButton/MDButtonRoot";

function Blog() {
  const [blogImage, setBlogImage] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [authorImage, setAuthorImage] = useState("");
  const quillRef = useRef(null);

  const handleFileChange = async (event, setFieldValue, fieldName) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
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
          if (fieldName === "blogImage") {
            setBlogImage({
              url: response.data.url,
              public_id: response.data.public_id,
            });
            setFieldValue(fieldName, response.data.url);
          } else if (fieldName === "authorImage") {
            setAuthorImage({
              url: response.data.url,
              public_id: response.data.public_id,
            });
            setFieldValue(fieldName, response.data.url);
          }
        } catch (error) {
          console.error("Error uploading image:", error);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const formik = useFormik({
    initialValues: {
      technology: "",
      blogImage: "",
      date: "",
      authorName: "",
      authorImage: "",
      blogTitle: "",
      blogDescription: "",
      category: "",
      otherDetails: "",
    },
    validationSchema: Yup.object({
      technology: Yup.string().required("Required"),
      blogImage: Yup.string().required("Required"),
      date: Yup.date().required("Required"),
      authorName: Yup.string().required("Required"),
      authorImage: Yup.string().required("Required"),
      blogTitle: Yup.string().required("Required"),
      blogDescription: Yup.string().required("Required"),
      category: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      console.log("Form data", values);
      try {
        const response = await axios.post("https://editsh-back.onrender.com/api/blogs/add", values);
        console.log(response);
        toast.success(response.data.message);
      } catch (error) {
        console.error("Error submitting form:", error);
        toast.error(error.response.data.message);
      }
    },
  });

  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.on("text-change", () => {
        formik.setFieldValue("otherDetails", editor.root.innerHTML);
      });
    }
  }, [formik]);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("https://editsh-back.onrender.com/api/blogs/view");
      setBlogs(response.data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to fetch testimonials");
    }
  };

  const handleDeleteTestimonial = async (id) => {
    try {
      const response = await axios.delete(`https://editsh-back.onrender.com/api/blogs/${id}`);
      if (response.status === 200) {
        toast.success(response.data.message);
        fetchBlogs();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete testimonial");
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <ToastContainer />
      <MDBox mt={6} mb={3}>
        <Grid container spacing={6} justifyContent="center">
          <Grid item xs={12} md={4}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Technology"
                    name="technology"
                    variant="filled"
                    size="small"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.technology}
                    error={formik.touched.technology && Boolean(formik.errors.technology)}
                    helperText={formik.touched.technology && formik.errors.technology}
                  />
                </Grid>

                <Grid item xs={12}>
                  <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                    Blog Image
                  </MDTypography>
                  <input
                    id="blogImage-input"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(event) => handleFileChange(event, formik.setFieldValue, "blogImage")}
                  />
                  <Avatar
                    alt="Blog Image"
                    src={blogImage?.url || ""}
                    onClick={() => document.getElementById("blogImage-input").click()}
                    style={{
                      cursor: "pointer",
                      width: 96,
                      height: 96,
                      margin: "auto",
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    size="small"
                    name="date"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.date}
                    error={formik.touched.date && Boolean(formik.errors.date)}
                    helperText={formik.touched.date && formik.errors.date}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Author Name"
                    name="authorName"
                    variant="filled"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.authorName}
                    error={formik.touched.authorName && Boolean(formik.errors.authorName)}
                    helperText={formik.touched.authorName && formik.errors.authorName}
                  />
                </Grid>

                <Grid item xs={12}>
                  <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                    Author Image
                  </MDTypography>
                  <input
                    id="authorImage-input"
                    type="file"
                    size="small"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(event) =>
                      handleFileChange(event, formik.setFieldValue, "authorImage")
                    }
                  />
                  <Avatar
                    alt="Author Image"
                    src={authorImage?.url || ""}
                    onClick={() => document.getElementById("authorImage-input").click()}
                    style={{
                      cursor: "pointer",
                      width: 96,
                      height: 96,
                      margin: "auto",
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Blog Title"
                    name="blogTitle"
                    variant="filled"
                    size="small"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogTitle}
                    error={formik.touched.blogTitle && Boolean(formik.errors.blogTitle)}
                    helperText={formik.touched.blogTitle && formik.errors.blogTitle}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Blog Description"
                    name="blogDescription"
                    variant="filled"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.blogDescription}
                    error={formik.touched.blogDescription && Boolean(formik.errors.blogDescription)}
                    helperText={formik.touched.blogDescription && formik.errors.blogDescription}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Category"
                    variant="filled"
                    name="category"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.category}
                    error={formik.touched.category && Boolean(formik.errors.category)}
                    helperText={formik.touched.category && formik.errors.category}
                  />
                </Grid>

                <Grid item xs={12}>
                  <label>Other Details</label>
                  <ReactQuill
                    ref={quillRef}
                    value={formik.values.otherDetails}
                    onChange={(content) => formik.setFieldValue("otherDetails", content)}
                  />
                </Grid>

                <Grid item xs={12}>
                  <MDButton type="submit" ariant="text" color="info">
                    Submit
                  </MDButton>
                </Grid>
              </Grid>
            </form>
          </Grid>
          <Grid item xs={12} md={8}>
            <Grid container spacing={4}>
              {blogs?.length > 0 ? (
                blogs?.map((blog) => (
                  <Grid item xs={12} sm={6} md={6} lg={6} key={blog._id}>
                    <Card>
                      <MDBox
                        p={2}
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        textAlign="center"
                      >
                        <Avatar
                          alt={blog?.blogImage}
                          src={blog.blogImage}
                          sx={{ width: "100%", height: "100px", mb: 2 }}
                        />

                        <MDTypography variant="h6" fontWeight="medium" gutterBottom>
                          {blog?.blogTitle}
                        </MDTypography>
                        <MDTypography variant="body2" color="text">
                          {new Date(blog?.date).toLocaleDateString()}
                        </MDTypography>
                        <MDButton
                          variant="text"
                          color="error"
                          onClick={() => handleDeleteTestimonial(blog._id)}
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
                  No Blogs available.
                </MDTypography>
              )}
            </Grid>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Blog;
