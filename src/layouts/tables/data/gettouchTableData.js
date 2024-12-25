import { useState, useEffect } from "react";
import axios from "axios";
import MDTypography from "components/MDTypography";
import { Avatar, Tooltip } from "@mui/material";

export default function Data() {
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await axios.get("https://editsh-back-anft.onrender.com/api/gettouch/view");
        setCandidates(response?.data?.data);
        console.log("resume", response.data?.data); // Logging the fetched data
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    fetchCandidates();
  }, []);

  return {
    columns: [
      { Header: "Name", accessor: "name", width: "20%", align: "left" },
      { Header: "Email", accessor: "email", align: "left" },
      { Header: "Mobile", accessor: "mobile", align: "center" },
      { Header: "Project Description", accessor: "projectDescription", align: "center" },
      { Header: "Budget", accessor: "budget", align: "center" },
      { Header: "Action", accessor: "action", align: "center" },
    ],

    rows: candidates?.map((candidate) => ({
      name: (
        <MDTypography variant="button" fontWeight="medium">
          {candidate?.name}
        </MDTypography>
      ),
      email: (
        <MDTypography component="a" variant="button" color="text" fontWeight="medium">
          {candidate.email}
        </MDTypography>
      ),
      mobile: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {candidate.mobile}
        </MDTypography>
      ),
      projectDescription: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {candidate.projectDescription}
        </MDTypography>
      ),
      budget: (
        <MDTypography variant="caption" color="text" fontWeight="medium">
          {candidate.budget}
        </MDTypography>
      ),
      action: (
        <Tooltip
          title={
            <MDTypography variant="body2">{`${candidate.firstName} ${candidate.lastName}`}</MDTypography>
          }
          arrow
        >
          <MDTypography component="a" href={candidate?.document} target="_blank" color="text">
            <Avatar
              src={candidate?.document}
              sx={{
                borderRadius: "50%",
                transition: "transform 0.3s ease-in-out",
                "&:hover": {
                  transform: "scale(1.1)",
                  cursor: "pointer",
                },
              }}
            />
          </MDTypography>
        </Tooltip>
      ),
    })),
  };
}
