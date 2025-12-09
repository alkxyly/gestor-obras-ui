import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';
import { CoreModule } from './demo/components/core/core.module';
import { AuthModule } from './demo/components/auth/auth.module';
import { ConfirmationService, MessageService } from 'primeng/api';



@NgModule({
    declarations: [AppComponent, NotfoundComponent],
    imports: [
        CoreModule,
        AppRoutingModule, 
        AppLayoutModule,
        AuthModule
    ],
    providers: [
        CountryService,
        CustomerService,
        EventService, 
        IconService, 
        NodeService,
        PhotoService, 
        ProductService,
        ConfirmationService,
        MessageService
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
