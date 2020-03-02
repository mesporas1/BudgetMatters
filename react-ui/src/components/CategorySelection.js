import React, {useState, useEffect, useCallback} from 'react';
import '../App.css';
const axios = require('axios');

function CategorySelection(props){
    
    const [newCategory, setNewCategory] = useState(props.category);
  
    
    const updateCategory = async (category) => {
            const result = await axios.post('/user/updateTransaction', {
                transactionId: props.id,
                category: category
            })
      }
      
    

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
    return <div>
        <select value={newCategory} onChange={e => {setNewCategory(e.target.value)
                updateCategory(e.target.value)
            }}>
            { props.categories.data.categories.map((function(category){
                return <option value={category.name}>{category.name}</option>
            })) }
        </select>
    </div>
    
}

export default CategorySelection;