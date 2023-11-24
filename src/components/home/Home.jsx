import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import SearchBar from "./searchBar/searchBar";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import LastPageIcon from "@mui/icons-material/LastPage";
import profileImg from "./admin.png";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import "./Home.css";
function Home() {
  const [data, setData] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [editRowId, setEditRowId] = useState(null);
  const [editedName, setEditedName] = useState("");
  const [editedEmail, setEditedEmail] = useState("");
  const [editedRole, setEditedRole] = useState("");


  useEffect(() => {
    fetch(
      "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
    )
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredRows(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredRows]);

  const handleSearch = (query) => {
    const filteredData = data.filter((row) =>
      Object.values(row).some(
        (value) =>
          value &&
          typeof value === "string" &&
          value.toLowerCase().includes(query.toLowerCase())
      )
    );
    setFilteredRows(filteredData);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    const totalPages = Math.ceil(filteredRows.length / pageSize);
    const newPage = Math.min(Math.max(pageNumber, 1), totalPages);
    setCurrentPage(newPage);
  };

  const handleRowSelection = (selectedRowIds) => {
    setSelectedRows(selectedRowIds);
  };
  const handleDeleteSelectedRows = () => {
    const prevTotalCount = filteredRows.length;

    const updatedRows = filteredRows.filter(
      (row) => !selectedRows.includes(row.id)
    );

    setFilteredRows(updatedRows);
    setSelectedRows([]);

    const updatedTotalCount = updatedRows.length;
    console.log(
      `Previous Total Count: ${prevTotalCount}, Updated Total Count: ${updatedTotalCount}`
    );
  };

  const handleRowsPerPageChange = (pageSize) => {
    setPageSize(pageSize);
    setCurrentPage(1);
  };

  const handleNextPage = () => {
    const totalPages = Math.ceil(filteredRows.length / pageSize);
    const nextPage = currentPage + 1;
    const lastPage = Math.ceil(filteredRows.length / pageSize);
    setCurrentPage(nextPage > lastPage ? lastPage : nextPage);
  };

  const handlePreviousPage = () => {
    const previousPage = currentPage - 1;
    setCurrentPage(previousPage < 1 ? 1 : previousPage);
  };

  const handleFirstPage = () => {
    setCurrentPage(1);
  };

  const handleLastPage = () => {
    const lastPage = Math.ceil(filteredRows.length / pageSize);
    setCurrentPage(lastPage);
  };


  const handleDelete = (id) => {
    const updatedRows = filteredRows.filter((row) => row.id !== id);
    setFilteredRows(updatedRows);
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.filter((selectedId) => selectedId !== id)
    );
  };
  const handleEdit = (id) => {
    setEditRowId(id);
    const rowToEdit = filteredRows.find((row) => row.id === id);
    setEditedName(rowToEdit.name);
    setEditedEmail(rowToEdit.email);
    setEditedRole(rowToEdit.role);
  };

  const handleSave = (id) => {
    const updatedRows = filteredRows.map((row) => {
      if (row.id === id) {
        return {
          ...row,
          name: editedName,
          email: editedEmail,
          role: editedRole,
        };
      }
      return row;
    });
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(editedEmail)) {
    alert("Please enter a valid email address.");
    return;}
    setFilteredRows(updatedRows);
    setEditRowId(null);
  };

  const renderCell = (params) => {
    if (params.row.id === editRowId) {
      return (
        <div style={{ display: "flex" }}>
          <input
            value={
              params.field === "name"
                ? editedName
                : params.field === "email"
                ? editedEmail
                : editedRole
            }
            onChange={(e) => {
              if (params.field === "name") {
                setEditedName(e.target.value);
              } else if (params.field === "email") {
                setEditedEmail(e.target.value);
              } else if (params.field === "role") {
                setEditedRole(e.target.value);
              }
            }}
            onBlur={() => handleSave(params.row.id)}
          />
          <IconButton onClick={() => handleSave(params.row.id)}>
          </IconButton>
        </div>
      );
    }
    return params.value;
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", width: 160, renderCell },
    { field: "email", headerName: "Email", width: 220, renderCell },
    { field: "role", headerName: "Role", width: 130, renderCell },
    {
      field: "action",
      headerName: "Action",
      width: 130,
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleEdit(params.row.id)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon className="delete-icon" />
          </IconButton>
        </div>
      ),
    },
  ];

  const rowsForCurrentPage = filteredRows.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalRowCount = filteredRows.length;

  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };
  const darkThemeClass = isDarkMode ? "dark-theme" : "light-theme";

  return (
    <div className={`home ${darkThemeClass}`}>
      <div className="topbar">
        <div className="searchbar">
          <input
            style={{
              width: "400px",
              height: "20px",
              padding: "10px",
              border: "1px solid #ccc",
              borderRadius: "20px",
              fontSize: "16px",
              outline: "none",
              margin: "10px",
              marginRight: "20px",
            }}
            className="searchbar"
            type="text"
            placeholder="Search..."
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="profile">
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              className="material-icons"
              style={{ fontSize: "24px", marginRight: "16px" }}
            >
              <NotificationsActiveIcon className="notification" />
            </span>
            {isDarkMode ? (
              <span
                className="material-icons"
                style={{ fontSize: "24px", color:"yellow" }}
                onClick={handleThemeToggle}
              >
                <DarkModeIcon className="theme" />
              </span>
            ) : (
              <span
                className="material-icons"
                style={{ fontSize: "24px" }}
                onClick={handleThemeToggle}
              >
                <LightModeIcon className="theme" />
              </span>
            )}
          </div>
          <span className="admin-name">Admin</span>
          <img
            src={profileImg}
            alt="Profile"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              marginRight: "8px",
              paddingRight: "10px",
            }}
          />
        </div>
      </div>

      <DataGrid
        rows={rowsForCurrentPage}
        columns={columns}
        checkboxSelection
        hideFooterPagination
        onSelectionModelChange={handleRowSelection}
        selectionModel={selectedRows}
        classes={{
          root: `${darkThemeClass}`,
          cell: `${darkThemeClass}`,
          header: `${darkThemeClass}`,
          columnHeader:`${darkThemeClass}`,
        }}
      />
      <div className="btn-container">
        <div className="left">
          <button className="delete-btn" onClick={handleDeleteSelectedRows}>
            Delete Selected
          </button>
        </div>
        <div className="right">
          <IconButton
            onClick={handleFirstPage}
            classes={{ root: "icon-button" }}
          >
            <FirstPageIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handlePreviousPage}
            classes={{ root: "icon-button" }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>
          {[
            ...Array(Math.min(Math.ceil(filteredRows.length / pageSize), 5)),
          ].map((_, index) => (
            <button
              key={index}
              className={`page-number ${
                currentPage === index + 1 ? "active" : ""
              }`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
          {Math.ceil(filteredRows.length / pageSize) > 5 && (
            <span className="ellipsis">...</span>
          )}
          {[
            ...Array(
              Math.ceil(filteredRows.length / pageSize) -
                Math.min(Math.ceil(filteredRows.length / pageSize), 5)
            ),
          ].map((_, index) => (
            <button
              key={
                index + Math.min(Math.ceil(filteredRows.length / pageSize), 5)
              }
              className={`page-number ${
                currentPage ===
                index +
                  Math.min(Math.ceil(filteredRows.length / pageSize), 5) +
                  1
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handlePageChange(
                  index +
                    Math.min(Math.ceil(filteredRows.length / pageSize), 5) +
                    1
                )
              }
            >
              {index +
                Math.min(Math.ceil(filteredRows.length / pageSize), 5) +
                1}
            </button>
          ))}
          {Math.ceil(filteredRows.length / pageSize) > 5 && (
            <span className="ellipsis">...</span>
          )}
          <IconButton
            onClick={handleNextPage}
            classes={{ root: "icon-button" }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleLastPage}
            classes={{ root: "icon-button" }}
          >
            <LastPageIcon fontSize="small" />
          </IconButton>
          <span>Total Rows: {totalRowCount}</span>
        </div>
      </div>
      </div>

  );
}

export default Home;
