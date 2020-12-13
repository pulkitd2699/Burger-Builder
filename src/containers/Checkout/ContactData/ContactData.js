import React, { Component } from 'react';
import {connect} from 'react-redux';
import Button from '../../../components/UI/Button/Button';
import classes from './ContactData.module.css';
import Spinner from '../../../components/UI/Spinner/Spinner';
import axios from '../../../axios';
import Input from '../../../components/UI/Input/Input';

class ContactData extends Component {
    state = {
        orderForm: {
            name:  {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                // whether user has touched the data before showing the invalid css
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipcode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Zip Code'
                },
                value: '',
                validation: {
                    required: true,
                    length: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your Mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: '',
                touched: false,
                valid: true,
                validation: {}
            }
        },
        loading: false,
        formIsValid: false
    }

    orderHandler = (event) => {
        event.preventDefault();
        this.setState({ loading: true });
        const formData = {};
        for(let formElId in this.state.orderForm){
            formData[formElId] = this.state.orderForm[formElId].value;
        }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: formData
        }
        //firebase automatically creates the orders endpoint
        axios.post('/orders.json', order)
            .then(response => {
                // console.log(response)
                this.setState({ loading: false });
                this.props.history.push('/')
            })
            .catch(error => {
                // console.log(error);
                this.setState({ loading: false });
            });
    };

    checkValidity(value, rules){
        let isValid = true;

        if(rules.required){
            //trim() removes any whitespaces
            isValid = value.trim() !== '' && isValid;
        }

        if(rules.length){
            isValid = (value.length === rules.length) && isValid;
        }

        return isValid;
    }

    inputChangedHandler = (event, inputIdentifier) => {
        // console.log(event.target.value);
        const updatedOrderForm = {
            ...this.state.orderForm
        };
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        };
        updatedFormElement.value = event.target.value;
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
        updatedFormElement.touched = true;
        // console.log(updatedFormElement);
        updatedOrderForm[inputIdentifier] = updatedFormElement;
        let formIsValid = true;
        for(let inputIdentifiers in updatedOrderForm){
            formIsValid = updatedOrderForm[inputIdentifiers].valid && formIsValid;
        }
        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid});
    }

    render() {

        const formElementsArray = [];
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
        }

        let form = (
            <form onSubmit={this.orderHandler}>
                {/* <Input elementType="..." elementConfig="..." value="..." /> */}
                {formElementsArray.map(formElement => {
                    return <Input 
                        key={formElement.id}
                        elementType={formElement.config.elementType}
                        elementConfig={formElement.config.elementConfig}
                        value={formElement.config.value}
                        changed={(event) => this.inputChangedHandler(event, formElement.id)}
                        invalid={!formElement.config.valid}
                        shouldValidate={formElement.config.validation}
                        touched={formElement.config.touched}
                    />
                })}
                <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
            </form>
        );

        if (this.state.loading) {
            form = <Spinner />
        }

        return (
            <div className={classes.ContactData}>
                <h4>Enter your contact details</h4>
                {form}
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.ingredients,
        price: state.totalPrice
    }
}

export default connect(mapStateToProps)(ContactData);