import {Component} from "@angular/core";
import {Observable} from "rxjs/Rx";

import {ContextService} from "../../services/context/context.service";
import {DomEventService} from "../../services/dom/dom-event.service";
import {EventHubService} from "../../services/event-hub/event-hub.service";
import {FileRegistry} from "../../services/file-registry.service";
import {GuidService} from "../../services/guid.service";
import {InputPortService} from "../../services/input-port/input-port.service";
import {LayoutComponent} from "../layout/layout.component";
import {PlatformAPI} from "../../services/api/platforms/platform-api.service";
import {SBPlatformDataSourceService} from "../../sources/sbg/sb-platform.source.service";
import {SettingsService} from "../../services/settings/settings.service";
import {UrlValidator} from "../../validators/url.validator";
import {UserPreferencesService} from "../../services/storage/user-preferences.service";

require("./../../../assets/sass/main.scss");
require("./main.component.scss");

@Component({
    selector: "cottontail",
    template: `
        <ct-layout class="editor-container"></ct-layout>
        <div id="runnix" [class.active]="runnix | async"></div>
    `,
    directives: [
        LayoutComponent,
    ],
    providers: [
        EventHubService,
        FileRegistry,
        DomEventService,
        UrlValidator,
        InputPortService,
        PlatformAPI,
        SBPlatformDataSourceService,
        SettingsService,
        UserPreferencesService,
        GuidService,
        ContextService,
    ],
})
export class MainComponent {

    private runnix: Observable<boolean>;

    constructor() {
        this.runnix = Observable.fromEvent(document, "keyup").map((e: KeyboardEvent) => e.keyCode).bufferCount(10, 1)
            .filter(seq => seq.toString() == [38, 38, 40, 40, 37, 39, 37, 39, 66, 65].toString())
            .map(seq => Observable.of(true).concat(Observable.of(false).delay(3000)))
            .concatAll();
    }
}
