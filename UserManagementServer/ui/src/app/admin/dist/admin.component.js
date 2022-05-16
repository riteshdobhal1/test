"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AdminComponent = void 0;
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var introJs = require("intro.js/intro.js");
var introSteps = require("../shared/pagetour");
var globals = require("../shared/global");
var AdminComponent = /** @class */ (function () {
    function AdminComponent(onscreenConstants, router, adminService) {
        this.onscreenConstants = onscreenConstants;
        this.router = router;
        this.adminService = adminService;
        this.helperFlag = false;
        this.page = globals.pageTourFlag;
        this.onscreenflag = globals.onscreenFlag;
        this.onscreen = false;
        this.introJS = introJs();
        this.showPoweredBy = false;
    }
    AdminComponent.prototype.ngOnInit = function () {
        if (this.adminService.mpseData === null) {
            this.getMPSEConfig();
        }
        if (this.adminService.loggedInUserDetails === null) {
            this.getLoggedInUserDetails();
        }
    };
    AdminComponent.prototype.expandHelper = function () {
        this.helperFlag = !this.helperFlag;
    };
    AdminComponent.prototype.getLoggedInUserDetails = function () {
        var _this = this;
        this.userLoading = true;
        this.adminService.fetchLoggedInUserDetails().subscribe(function (data) {
            _this.adminService.setLoggedInUserDetails(data);
            _this.userLoading = false;
        });
    };
    AdminComponent.prototype.getMPSEConfig = function () {
        var _this = this;
        this.mpseConfigLoading = true;
        this.adminService.getMPSEconfigDetails().subscribe(function (response) {
            _this.adminService.setMPSEDetails(response);
            _this.mpseConfigLoading = false;
            var val = _this.adminService.getInternalLogo();
            if (val && val !== 'NA') {
                _this.showPoweredBy = true;
            }
            else {
                _this.showPoweredBy = false;
            }
        });
    };
    AdminComponent.prototype.togglePageInfo = function () {
        this.introJS.setOptions({
            showStepNumbers: false,
            showBullets: false,
            exitOnOverlayClick: false,
            doneLabel: "Close",
            nextLabel: "Next",
            prevLabel: "Back",
            showProgress: true
        });
        if (this.router.url.indexOf("/users") !== -1) {
            this.introJS.setOptions({
                steps: introSteps.userIntro
            });
        }
        else if (this.router.url.indexOf("/roles") !== -1) {
            this.introJS.setOptions({
                steps: introSteps.roleIntro
            });
        }
        else {
            this.introJS.setOptions({
                steps: introSteps.endCustIntro
            });
        }
        this.introJS.start();
    };
    AdminComponent.prototype.toggleOnScreen = function () {
        this.onscreen = !this.onscreen;
        this.onscreenConstants.onscreen = this.onscreen;
    };
    AdminComponent.prototype.getOnScreenStatus = function () {
        return this.onscreenConstants.onscreen;
    };
    AdminComponent = __decorate([
        core_1.Component({
            selector: 'app-admin',
            templateUrl: './admin.component.html',
            styleUrls: ['./admin.component.scss'],
            encapsulation: core_2.ViewEncapsulation.None
        })
    ], AdminComponent);
    return AdminComponent;
}());
exports.AdminComponent = AdminComponent;
