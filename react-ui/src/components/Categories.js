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

function Categories(props) {
  const classes = useStyles();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    //setIsFetching(true);
    const fetchCategories = async () => {
      const result = await axios.get("/category/getAll");
      setCategories(result.data.categories);
      setIsFetching(false);
    };
    fetchCategories();
  }, [isFetching]);

  function addCategory(category) {
    try {
      const add_category = async () => {
        await axios.post("/category/add", {
          categoryName: category,
        });
        /*.then(() => {
                        const url = '/plaid/transactions/' + metadata.institution.name
                        return axios.get(url)
                    })
                    .then((response) => {
                        console.log('Response', response)
                    })*/
        setIsFetching(true);
      };
      add_category();
      console.log("did the category get added");
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <div className={classes.categories}>
      <Typography variant="h4">Check Categories</Typography>
      <Paper className={classes.paper}>
        <List>
          {isFetching
            ? "Fetching categories from API"
            : categories.map((category) => (
                <ListItem key={category._id}>
                  <ListItemText
                    primary={category.name || "null"}
                  ></ListItemText>
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
        </List>
      </Paper>

      <form
        className={classes.form}
        onSubmit={() => {
          addCategory(newCategory);
        }}
      >
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
    </div>
  );
}

export default Categories;
