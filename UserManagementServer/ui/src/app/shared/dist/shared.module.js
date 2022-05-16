"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SharedModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var ngx_pretty_checkbox_1 = require("ngx-pretty-checkbox");
var angular_fontawesome_1 = require("@fortawesome/angular-fontawesome");
var forms_1 = require("@angular/forms");
var forms_2 = require("@angular/forms");
var free_solid_svg_icons_1 = require("@fortawesome/free-solid-svg-icons");
var free_regular_svg_icons_1 = require("@fortawesome/free-regular-svg-icons");
var free_brands_svg_icons_1 = require("@fortawesome/free-brands-svg-icons");
var logo_component_1 = require("./logo/logo.component");
var footer_component_1 = require("./footer/footer.component");
var logout_component_1 = require("./logout/logout.component");
var loader_component_1 = require("./loader/loader.component");
var redirect_component_1 = require("./redirect/redirect.component");
var toast_notification_component_1 = require("./toast-notification/toast-notification.component");
var SharedModule = /** @class */ (function () {
    function SharedModule(library) {
        library.addIconPacks(free_solid_svg_icons_1.fas, free_regular_svg_icons_1.far, free_brands_svg_icons_1.fab);
    }
    SharedModule = __decorate([
        core_1.NgModule({
            declarations: [logo_component_1.LogoComponent, footer_component_1.FooterComponent, logout_component_1.LogoutComponent, loader_component_1.LoaderComponent, redirect_component_1.RedirectComponent, toast_notification_component_1.ToastsContainer],
            imports: [
                common_1.CommonModule,
                ng_bootstrap_1.NgbModule,
                angular_fontawesome_1.FontAwesomeModule,
                ngx_pretty_checkbox_1.NgxPrettyCheckboxModule,
                forms_1.FormsModule,
                forms_2.ReactiveFormsModule
            ],
            exports: [
                ng_bootstrap_1.NgbModule,
                angular_fontawesome_1.FontAwesomeModule,
                ngx_pretty_checkbox_1.NgxPrettyCheckboxModule,
                forms_1.FormsModule,
                forms_2.ReactiveFormsModule,
                logo_component_1.LogoComponent,
                footer_component_1.FooterComponent,
                logout_component_1.LogoutComponent,
                loader_component_1.LoaderComponent,
                toast_notification_component_1.ToastsContainer,
                redirect_component_1.RedirectComponent
            ]
        })
    ], SharedModule);
    return SharedModule;
}());
exports.SharedModule = SharedModule;
