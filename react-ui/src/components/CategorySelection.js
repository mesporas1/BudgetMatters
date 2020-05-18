import React, { useState, useEffect, useCallback } from "react";

import {
  makeStyles,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@material-ui/core";

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "130px",
  },
}));

function CategorySelection(props) {
  const classes = useStyles();
  const [newCategory, setNewCategory] = useState(props.category);

  const updateCategory = async (category) => {
    const result = await axios.post("/user/updateTransaction", {
      transactionId: props.id,
      category: category,
    });
  };

  /*function updateCategory(category){
        try {
            const add_category = async () => {
                await axios.post('/category/add',{
                    categoryName: category
                    })
                setIsFetching(true);
            }
            add_category()
            console.log("did the category get added")
        }    catch (e) {
            console.log(e);
    }
    }*/
  return (
    <FormControl className={classes.formControl}>
      <InputLabel id="select-category-label"></InputLabel>
      <Select
        labelId="select-category-label"
        id="select-category"
        value={newCategory}
        onChange={(e) => {
          setNewCategory(e.target.value);
          updateCategory(e.target.value);
        }}
      >
        {props.categories.data.categories.map((category) => {
          return <MenuItem value={category.name}>{category.name}</MenuItem>;
        })}
      </Select>
    </FormControl>
  );
}

export default CategorySelection;
