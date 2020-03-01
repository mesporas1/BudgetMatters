import React, {useState, useEffect, useCallback} from 'react';
import '../App.css';
const axios = require('axios');

function Categories(props){
    
    
    const [categories, setCategories] = useState(<th> No categories </th>);
    const [newCategory, setNewCategory] = useState('');
    const [isFetching, setIsFetching] = useState(false);
  
    useEffect(() => {
      //setIsFetching(true);
      const fetchCategories = async () => {
            const result = await axios.get('/category/getAll')
            setCategories(result.data.categories.map((function(category){
            return <tr key = {category._id}>
                <th>{category.name}</th>
            </tr>
            })))
            setIsFetching(false)
      }
      fetchCategories()
    }, [isFetching]);

    function addCategory(category){
        try {
            const add_category = async () => {
                await axios.post('/category/add',{
                    categoryName: newCategory
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
    <table>
        <tr>
            <th>Category</th>
        </tr>
        { isFetching ? 'Fetching categories from API': categories   } 
    </table>
    <form onSubmit={() => {
            addCategory(newCategory)
        }}>
            <input type="text"
                value={newCategory}
                onChange={event => setNewCategory(event.target.value)}
            ></input>
            <button type="submit">Add Category</button>
        </form>

    </div>
    
}

export default Categories;