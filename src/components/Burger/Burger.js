import React from 'react';
import classes from './Burger.module.css';

import BurgerIngredient from './BurgerIngredients/BurgerIngredients';

const burger = (props) => {
    let array_ingredients = Object.keys(props.ingredients);
    // console.log(array_ingredients);
    let transformed_ingredients = array_ingredients.map(igKey => {
        return [...Array(props.ingredients[igKey])].map( (_,i) => {
            return <BurgerIngredient key={igKey+i} type={igKey}/>;
        });
    });
    // console.log(transformed_ingredients);
    transformed_ingredients = transformed_ingredients.reduce((arr,el) => {
        return arr.concat(el);
    }, []);
    // console.log(transformed_ingredients);

    if(transformed_ingredients.length === 0){
        transformed_ingredients = <p>Please start adding ingredients</p>
    }

    return (
        <div className={classes.Burger}>
            <BurgerIngredient type="bread-top"/>
            {transformed_ingredients}
            <BurgerIngredient type="bread-bottom"/>
        </div>
    );
};

export default burger;