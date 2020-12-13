import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Auxiliary/Auxiliary';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import axios from '../../axios';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import * as actionTypes from '../../store/actions';


class BurgerBuilder extends Component{

    state = {
        purchasing: false,
        loading: false,
        error: false
    }

    //best way for fetching data
    componentDidMount(){
        // axios.get('https://burger-builder-33d74.firebaseio.com/ingredients.json')
        // .then(response => {
        //     this.setState({ingredients: response.data});
        // })
        // .catch(error => {this.setState({error: true})
        // });
    }

    updatePurchaseState(ingredients){
        const sum = Object.keys(ingredients).map(igKey => {
            return ingredients[igKey];
        }).reduce((sum, el) => {
            return sum+el;
        }, 0);

        // this.setState({purchaseable: sum>0});
        return sum > 0;
    }

    // addIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     const oldPrice = this.state.totalPrice;
    //     const updatedIngredient = {
    //         ...this.state.ingredients
    //     }
    //     updatedIngredient[type] = oldCount+1;
    //     const updatedPrice = oldPrice + INGREDIENT_PRICES[type];
    //     this.setState({
    //         ingredients: updatedIngredient,
    //         totalPrice: updatedPrice
    //     });
    //     this.updatePurchaseState(updatedIngredient);
    // };

    // removeIngredientHandler = (type) => {
    //     const oldCount = this.state.ingredients[type];
    //     if(oldCount <= 0) return;
    //     const oldPrice = this.state.totalPrice;
    //     const updatedIngredient = {
    //         ...this.state.ingredients
    //     }
    //     updatedIngredient[type] = oldCount-1;
    //     const updatedPrice = oldPrice - INGREDIENT_PRICES[type];
    //     this.setState({
    //         ingredients: updatedIngredient,
    //         totalPrice: updatedPrice
    //     });
    //     this.updatePurchaseState(updatedIngredient);
    // };

    purchaseHandler = () => {
        this.setState({purchasing: true});
    };

    purchaseCancelHandler = () => {
        this.setState({purchasing: false});
    };

    purchaseContinueHandler = () => {
        // alert('You Continue');

        // const queryParams = []
        // //encodeURIComponent is used so that critical variables can be used in url
        // for(let i in this.state.ingredients){
        //     queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        // }
        // queryParams.push('price=' + this.state.totalPrice);
        // const queryString = queryParams.join('&');
        // this.props.history.push({
        //     pathname: '/checkout',
        //     search: '?' + queryString
        // });
        this.props.history.push('/checkout');
    };

    render(){

        const disabledInfo = {
            // ...this.state.ingredients
            ...this.props.ings
        };

        for(let key in disabledInfo){
            disabledInfo[key] = disabledInfo[key] <= 0;
        }

        // console.log(disabledInfo);
        let orderSummary = null;
        if(this.state.ingredients){
            orderSummary = <OrderSummary 
                ingredients={this.props.ings}
                price={this.props.price}
                purchaseCanceled={this.purchaseCancelHandler}
                purchaseContinued={this.purchaseContinueHandler}
            />
        }

        if(this.state.loading){
            orderSummary = <Spinner />;
        }

        let burger = this.state.error ? <p>Ingredients can't be loaded</p> : <Spinner />

        if(this.props.ings)
        burger = (
            <Aux>
                <Burger ingredients={this.props.ings}/>
                <BuildControls 
                    // ingredientAdded={this.addIngredientHandler}
                    // ingredientRemoved={this.removeIngredientHandler}
                    ingredientAdded={this.props.onIngredientAdded}
                    ingredientRemoved={this.props.onIngredientRemoved}
                    disabled={disabledInfo}
                    // purchaseable={this.state.purchaseable}
                    purchaseable={this.updatePurchaseState(this.props.ings)}
                    // price={this.state.totalPrice}
                    price={this.props.price}
                    ordered={this.purchaseHandler}
                />
            </Aux>
        );


        return(
            <Aux>
                <Modal 
                    show={this.state.purchasing}
                    modalClosed={this.purchaseCancelHandler}>
                    {orderSummary}
                </Modal>
                {burger}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch({type: actionTypes.ADD_INGREDIENT, ingredientName: ingName}),
        onIngredientRemoved: (ingName) => dispatch({type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName})
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(BurgerBuilder, axios));