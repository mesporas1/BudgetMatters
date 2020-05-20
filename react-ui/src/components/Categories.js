import React, { useState, useEffect, useCallback } from "react";
import "../App.css";

import {
  makeStyles,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Typography,
  TextField,
  IconButton,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  categories: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  paper: {
    width: "50%",
    margin: theme.spacing(2),
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    marginTop: theme.spacing(1),
  },
}));

const Categories = (props) => {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await axios.get("/category/getAll");
      setCategories(result.data.categories);
      setIsFetching(false);
    };
    fetchCategories();
  }, [isFetching]);

  const add_category = async (category) => {
    await axios.post("/category/add", {
      categoryName: category,
    });
    setIsFetching(true);
  };

  const addCategory = (category) => {
    try {
      add_category(category);
    } catch (error) {
      console.log(error);
    }
  };

  const remove_category = async (id) => {
    await axios.post("/category/remove", {
      categoryId: id,
    });
    setIsFetching(true);
  };

  const removeCategory = (event) => {
    event.preventDefault();
    const id = event.currentTarget.id;
    try {
      remove_category(id);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addCategory(newCategory);
    setNewCategory("");
  };

  return (
    <div className={classes.categories}>
      <Typography variant="h4">Check Categories</Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <TextField
          id="add-category"
          label="Category"
          type="text"
          margin="normal"
          size="small"
          required
          variant="outlined"
          value={newCategory}
          onChange={(event) => setNewCategory(event.target.value)}
        />
        <Button
          className={classes.button}
          variant="contained"
          size="large"
          color="primary"
          type="submit"
        >
          Add Category
        </Button>
      </form>
      <Paper className={classes.paper}>
        <List>
          {isFetching
            ? "Fetching categories from API"
            : categories.map((category) => (
                <ListItem key={category._id} id={category._id}>
                  <ListItemText primary={category.name || "null"} />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={removeCategory}
                      id={category._id}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
        </List>
      </Paper>
    </div>
  );
};

export default Categories;
