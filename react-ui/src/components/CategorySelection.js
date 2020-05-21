import React, { useState, useEffect, useCallback } from "react";

import { makeStyles, FormControl, Select, MenuItem } from "@material-ui/core";

const axios = require("axios");

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "140px",
  },
}));

function CategorySelection({ id, category, categories }) {
  const classes = useStyles();
  const [newCategory, setNewCategory] = useState(category);

  const updateCategory = async (category) => {
    const result = await axios.post("/user/updateTransaction", {
      transactionId: id,
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
      <Select
        labelId="select-category-label"
        id="select-category"
        value={newCategory}
        onChange={(e) => {
          setNewCategory(e.target.value);
          updateCategory(e.target.value);
        }}
      >
        {categories.map((category) => {
          return (
            <MenuItem key={category._id} value={category.name}>
              {category.name}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export default CategorySelection;
