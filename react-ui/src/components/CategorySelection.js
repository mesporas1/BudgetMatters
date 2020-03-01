import React, {useState, useEffect, useCallback} from 'react';
import '../App.css';
const axios = require('axios');

function CategorySelection(props){
    
    const [categories, setCategories] = useState(<th> No categories </th>);
    const [newCategory, setNewCategory] = useState(props.category);
    const [isFetching, setIsFetching] = useState(false);
  
    useEffect(() => {
      //setIsFetching(true);
      const fetchCategories = async () => {
            const result = await axios.get('/category/getAll')
            setCategories(result.data.categories.map((function(category){
                return <option value={category.name}>{category.name}</option>
            })))
            setIsFetching(false)
      }
      fetchCategories()
    }, [isFetching]);

    function updateCategory(category){
        try {
            const add_category = async () => {
                await axios.post('/category/add',{
                    categoryName: category
                    })
                    /*.then(() => {
                        const url = '/plaid/transactions/' + metadata.institution.name
                        return axios.get(url)
                    })
                    .then((response) => {
                        console.log('Response', response)
                    })*/
                setIsFetching(true);
            }
            add_category()
            console.log("did the category get added")
        }    catch (e) {
            console.log(e);
    }
    }
    return <div>
        <select value={newCategory} onChange={e => setNewCategory(e.target.value)}>
            { categories }
        </select>
    </div>
    
}

export default CategorySelection;