import { Component, OnInit } from '@angular/core';
import {CartModelServer} from '../../models/cart.model';
import {CartService} from '../../services/cart.service';
import {OrderService} from '../../services/order.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ICreateOrderRequest, IPayPalConfig} from 'ngx-paypal';
import { loadStripe } from '@stripe/stripe-js';
import {HttpClient} from '@angular/common/http';
import { MessageService } from '../../services/message.service';
import './../../../assets/js/smtp';
declare let Email: any;
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  public payPalConfig ?: IPayPalConfig;
  cartData: CartModelServer;
  cartTotal: number;
  showSpinner: boolean;
  strikeCheckout:any = null;
  checkoutForm: FormGroup;
  isSubmitted  =  false;
  constructor(private cartService: CartService,
              private Http:MessageService,
              private orderService: OrderService,
              private router: Router,
              private  spinner: NgxSpinnerService,
              private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.stripePaymentGateway();
    this.checkoutForm = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      Address: ['', [Validators.required]],
      City: ['', [Validators.required]],
      Country: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required,Validators.pattern("[+0-9 ]{13}")]],

    });

    this.initConfig();
    this.cartService.cartDataObs$.subscribe(data => this.cartData = data);
    this.cartService.cartTotal$.subscribe(total => this.cartTotal = total);

  }
  get f() { return this.checkoutForm.controls; }

  pay(amount) {
    const strikeCheckout = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51Im7cuEy802oXDM2s16FXUmRyAaIXt30Gu2AdIue8bRRtkUMtnFHiHORVgb08FptA03qFJI6pHqcNzziBCrj5OJl005k7omowz',
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken)
        alert('Stripe token generated!');
      }
    });

    strikeCheckout.open({
      name: 'RemoteStack',
      description: 'Payment widgets',
      amount: amount * 100
    });
  }
  onCheckout() {
    this.isSubmitted = true;
    // stop here if form is invalid
    if (this.checkoutForm.invalid) {
      return;
    }
    let user = {
      name: "aiman",
      email: "amo.junaid1@gmail.com"
    };
    this.Http.sendEmail('https://se-3dtraces.herokuapp.com/api/orders/sendmail', user).subscribe(
      data => {
        let res:any = data;
        console.log(
          `👏 > 👏 > 👏 > 👏 ${user.name} is successfully register and mail has been sent and the message id is ${res.messageId}`
        );
      },
      err => {
        console.log(err);
      },() => {
        console.log("error")
      }
    );
  //   Email.send({
  //     Host : "smtp.elasticemail.com",
  //     Username : 'amo.junaid1@gmail.com',
  //     Password : "A42D2A612638C4C98A023CBE4290E5C73725",
  //     To : "amo.junaid1@gmail.com",
  //     From : "amo.junaid1@gmail.com",
  //     Subject :" hello",
  //     Body : `<i>This is sent as a feedback from my resume page.</i> <br/> <b>Name: </b>${"123"} <br /> <b>Email: </b>${"amo.junaid1@gmail.com"}<br /> <b>Subject: </b>${"life is shit"}<br /> <b>Message:</b> <br /> ${"hey"} <br><br> <b>~End of Message.~</b> `
  // }).then( message => {alert(message);  } );


    this.spinner.show();
    this.cartService.CheckoutFromCart(1);
  }

  private initConfig(): void {
    this.payPalConfig = {
      currency: 'EUR',
      clientId: 'ARVegu43K5qlI65PGDVdA87ehCyaUTpVXxnB1F68RZAWMfyTrfel2COGW_h2DMVffreZfaAIxmwjIhuJ', // add paypal clientId here
      createOrderOnClient: (data) => <ICreateOrderRequest> {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'EUR',
            value: '0.01',
            breakdown: {
              item_total: {
                currency_code: 'EUR',
                value: '0.01'
              }
            }
          },
          items: [{
            name: 'The Swag Coder',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: '0.01',
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'checkout',
        layout: 'horizontal',
        size: 'small',
        color: 'gold',
        shape: 'rect',
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });

      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);

      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      }
    };
  }

  stripePaymentGateway() {
    if(!window.document.getElementById('stripe-script')) {
      const scr = window.document.createElement("script");
      scr.id = "stripe-script";
      scr.type = "text/javascript";
      scr.src = "https://checkout.stripe.com/checkout.js";

      scr.onload = () => {
        this.strikeCheckout = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51Im7cuEy802oXDM2s16FXUmRyAaIXt30Gu2AdIue8bRRtkUMtnFHiHORVgb08FptA03qFJI6pHqcNzziBCrj5OJl005k7omowz',
          locale: 'auto',
          token: function (token: any) {
            console.log(token)
            alert('Payment via stripe successfull!');
          }
        });
      }

      window.document.body.appendChild(scr);
    }
  }



}

