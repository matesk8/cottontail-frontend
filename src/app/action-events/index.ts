import {FileModel} from "../store/models/fs.models";
import {CwlFileTemplate} from "../types/file-template.type";
import {CommandInputParameterModel as InputProperty} from "cwlts/models/d2sb";
import {Observable} from "rxjs/Observable";
import {ExpressionEditorData} from "../models/expression-editor-data.model";
import {TabData} from "../components/workbox/tab-data.interface";

export class EventHubAction {
    public type: string;
    public payload: any;

    constructor(type: string, payload: any) {
        this.type    = type;
        this.payload = payload;
    }
}

/**
 * @deprecated
 */
export class OpenFileRequestAction extends EventHubAction {
    constructor(file: FileModel) {
        super("open_file_request", file);
    }
}

/**
 * @deprecated
 */
export class FetchFileRequestAction extends EventHubAction {
    constructor(file: FileModel) {
        super("fetch_file_request", file);
    }
}

/**
 * @deprecated
 */
export class SelectFileAction extends EventHubAction {
    constructor(file: FileModel) {
        super("select_file", file);
    }
}

/**
 * @deprecated
 */
export class CloseFileAction extends EventHubAction {
    constructor(file: FileModel) {
        super("close_file", file);
    }
}

export class UpdateFileAction extends EventHubAction {
    constructor(file: FileModel) {
        super("update_file", file);
    }
}

export class CreateFileRequestAction extends EventHubAction {
    constructor(options: {path: string, content?: string, template?: CwlFileTemplate}) {
        super("create_file_request", options);
    }
}

export class CopyFileRequestAction extends EventHubAction {
    constructor(source: string, destination: string) {
        super("copy_file_request", {source, destination});
    }
}

export class DeleteFileRequestAction extends EventHubAction {
    constructor(file: FileModel) {
        super("delete_file_request", file);
    }
}

export class DeleteFolderRequestAction extends EventHubAction {
    constructor(path: string) {
        super("delete_folder_request", path);
    }
}

export class FileDeletedAction extends EventHubAction {
    constructor(file: FileModel) {
        super("file_deleted", file);
    }
}

export class FolderDeletedAction extends EventHubAction {
    constructor(path: string) {
        super("folder_deleted", path);
    }
}

export class FileCreatedAction extends EventHubAction {
    constructor(file: FileModel) {
        super("file_created", file);
    }
}

export class SaveFileRequestAction extends EventHubAction {
    constructor(file: FileModel) {
        super("save_file_request", file);
    }
}

export class CreateFileResponse extends EventHubAction {
    constructor(file: FileModel) {
        super("create_file_response", file);
    }
}

export class ApiError extends EventHubAction {
    constructor(error: any) {
        super("api_error", error);
    }
}

export class OpenInputInspector extends EventHubAction {
    constructor(input: Observable<InputProperty>) {
        super("open_input_inspector", input);
    }
}

export class CloseInputInspector extends EventHubAction {
    constructor() {
        super("close_input_inspector", undefined);
    }
}

export class OpenExpressionEditor extends EventHubAction {
    constructor(expressionEditorEvent: ExpressionEditorData) {
        super("open_expression_editor", expressionEditorEvent);
    }
}

export class CloseExpressionEditor extends EventHubAction {
    constructor() {
        super("close_expression_editor", undefined);
    }
}

export class CwlValidationResult extends EventHubAction {
    constructor(validationResult: any) {
        super("cwl_validation_result", validationResult);
    }
}

export class UpdateBaseCommandExpression extends EventHubAction {
    constructor(expression: string) {
        super("update_expression", expression);
    }
}

export class UpdateInputPortExpression extends EventHubAction {
    constructor(expression: string) {
        super("update_input_port", expression);
    }
}

export class OpenTabAction extends EventHubAction {
    constructor(tab: TabData){
        super("open_tab", tab);
    }
}
