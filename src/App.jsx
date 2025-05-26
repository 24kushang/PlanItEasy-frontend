import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import axios from "axios";

export default function App() {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    setValue: setValueEdit,
    formState: { errors: errorsEdit },
  } = useForm();
  const [items, setItems] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  // Replace with your actual API Gateway endpoint
  const API_URL = "https://jflo8rhv52.execute-api.ap-south-1.amazonaws.com";

  const onSubmit = async (data) => {
    // Adapt form data to API format
    const payload = {
      name: data.name,
      description: data.description,
      date: new Date().toISOString().split("T")[0], // Example: today's date
      location: data.location,
      createdBy: "10608ab5-beb7-4557-9b46-4bd5b2f2d466",
      participants: "100",
    };

    try {
      const response = await axios.post(API_URL + "/addEvent", {
        ...payload,
      });

      if (response.status !== 201) throw new Error("Failed to add event");

      setItems((prev) => [...prev, payload]);
      setSnackbar({
        open: true,
        message: "Event added successfully!",
        severity: "success",
      });
      reset();
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    }
  };
  const onUpdate = async (data) => {
    // Adapt form data to API format
    const payload = {
      id: editId,
      name: data.name,
      description: data.description,
      date: new Date().toISOString().split("T")[0],
      location: data.location,
      createdBy: "10608ab5-beb7-4557-9b46-4bd5b2f2d466",
      participants: "100",
    };

    try {
      const response = await axios.put(API_URL + "/updateEvent", {
        ...payload,
      });

      if (response.status !== 200) throw new Error("Failed to update event");

      setItems((prev) =>
        prev.map((item) =>
          item.id === editId ? { ...item, ...payload } : item
        )
      );
      setSnackbar({
        open: true,
        message: "Event updated successfully!",
        severity: "success",
      });
      reset();
      setConfirmEditOpen(false); // Close the modal on success
      setEditId(null);
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    }
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/eventplan/${deleteId}`);
      setItems((prev) => prev.filter((i) => i.id !== deleteId));
      setSnackbar({
        open: true,
        message: "Event deleted successfully!",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete event.",
        severity: "error",
      });
    } finally {
      setConfirmDeleteOpen(false);
      setDeleteId(null);
    }
  };

  useEffect(() => {
    if (confirmEditOpen && editId) {
      const editItem = items.find((item) => item.id === editId);
      if (editItem) {
        setValueEdit("name", editItem.name);
        setValueEdit("description", editItem.description);
        setValueEdit("location", editItem.location);
      }
    }
    if (!confirmEditOpen) {
      resetEdit();
    }
  }, [confirmEditOpen, editId, items, setValueEdit, resetEdit]);

  useEffect(() => {
    fetchItems();
  }, []);

  // API Functions
  const fetchItems = async () => {
    // setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/getEvent`);
      console.log(response);
      setItems(response.data.items || []);
    } catch (error) {
      console.error("Error fetching records:", error);
      showSnackbar("Error fetching records. Please try again.", "error");
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
        }}
      >
        <Box sx={{ mx: "auto", mt: 4, maxWidth: "550px" }}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography
              className="text-3xl font-bold"
              variant="h6"
              gutterBottom
            >
              Add Event
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                label="Event Name"
                fullWidth
                margin="normal"
                error={!!errors.name}
                helperText={errors.name && "Event Name is required"}
                {...register("name", { required: true })}
              />
              <TextField
                label="Description"
                fullWidth
                margin="normal"
                error={!!errors.description}
                helperText={errors.description && "Description is required"}
                {...register("description", { required: true })}
              />
              <TextField
                label="Location"
                fullWidth
                margin="normal"
                error={!!errors.location}
                helperText={errors.location && "Location is required"}
                {...register("location", { required: true })}
              />
              {/* <Numb */}
              <Button type="submit" variant="contained" fullWidth>
                Submit
              </Button>
            </form>
          </Paper>
          <Divider sx={{ my: 2 }} />
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Event List
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              {items.map((item, idx) => (
                // <p>item.name</p>
                <Paper key={idx} elevation={3} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {item.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Date: {item.date}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    Location: {item.location}
                  </Typography>
                  <div style={{ display: "flex" }}>
                    <Button
                      type="button"
                      color="primary"
                      variant="contained"
                      fullWidth
                      sx={{ m: 1 }}
                      onClick={() => {
                        setEditId(item.id);
                        setConfirmEditOpen(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      type="button"
                      color="error"
                      variant="contained"
                      fullWidth
                      sx={{ m: 1 }}
                      onClick={() => {
                        setDeleteId(item.id);
                        setConfirmDeleteOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Paper>
              ))}
            </Box>
          </Paper>
          <Dialog
            open={confirmDeleteOpen}
            onClose={() => setConfirmDeleteOpen(false)}
          >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this event?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setConfirmDeleteOpen(false)}
                color="primary"
                variant="contained"
              >
                Cancel
              </Button>
              <Button onClick={handleDelete} color="error" variant="contained">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={confirmEditOpen}
            onClose={() => setConfirmEditOpen(false)}
          >
            <DialogTitle>Edit Event</DialogTitle>
            <Paper sx={{ p: 3 }}>
              {/* <form onSubmit={handleSubmit(onUpdate)}> */}
              <form onSubmit={handleSubmitEdit(onUpdate)}>
                <TextField
                  label="Event Name"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name && "Event Name is required"}
                  {...registerEdit("name", { required: true })}
                />
                <TextField
                  label="Description"
                  fullWidth
                  margin="normal"
                  error={!!errors.description}
                  helperText={errors.description && "Description is required"}
                  {...registerEdit("description", { required: true })}
                />
                <TextField
                  label="Location"
                  fullWidth
                  margin="normal"
                  error={!!errors.location}
                  helperText={errors.location && "Location is required"}
                  {...registerEdit("location", { required: true })}
                />
                {/* <Numb */}
                <Button type="submit" variant="contained" fullWidth>
                  Submit
                </Button>
              </form>
            </Paper>
          </Dialog>
          <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </div>
  );
}
