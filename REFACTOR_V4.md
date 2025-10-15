Refactor the attached Git repository's codebase to achieve a fully dynamic and configurable architecture based entirely on JSON definitions. The primary objective is to allow for the addition, removal, or modification of any study type (e.g., Knee, Foot, Spine) and their associated logic, UI structure, and follow-up questions solely through changes to the JSON configuration files, requiring no subsequent code changes or application redeployment.

Refactoring Requirement

Dynamic Study Configuration:

JSON-Driven Logic: The existing logic that drives the UI rendering, question flow (Parent > Child > Grandchild), and final report generation must be completely derived from a well-structured JSON configuration. Remove all hardcoded logic related to specific study types or their question-answer sequences.

Structured JSON: The JSON schema must be robust, logical, and designed specifically for future scalability, enabling the seamless integration of new study types with complex conditional logic.

Maintain UX: All refactoring must ensure the current User Experience (UX) and visual layout remain unchanged, except where explicitly noted in the "Required Functional Fixes" section below.

Required Functional Fixes

The following bugs and UI inconsistencies must be resolved as part of the refactoring:

UI and Formatting Issues

Missing Grandchild Follow-up UI: The UI differentiator/extent (e.g., dedicated visual element or formatting) for Grandchild follow-up questions is missing for the "Knee" study type. This visual element should be rendered similarly to how it currently appears for "Foot Degenerative Changes."

Duplicate Subheaders: Remove the duplicate subheader text that appears directly beneath each selectable option's name across all study types.

Study-Specific Report Rendering Errors

Shoulder Degenerative Changes: Grandchild input values for "Degenerative changes of the Shoulder" are not correctly rendered in the final Generated Report box.

Lesion Input Error (common issue): In the "Lesion" section, if findings are input (typed) and the main option is then changed to "Yes," the output box removes the trailing typed inputs erroneously preserves Lesion, instead correctly updating them.

Foot Hardware Rendering: For the "Foot" study type, the follow-up inputs for the following three multiselect hardware options are not being rendered in the generated report box:

Plate and screw fixation

Arthrodesis and screw fixation

K wire

Spine Degenerative Changes - Facet Arthritis: In the "SPINE" study type, under option 4. "Multilevel degenerative changes," the output for "Facet arthritis severity" is not rendered in the generated report box.

Spine Anterolisthesis Logic Error: Under option 6. "Anterolisthesis," if the user selects the "Absent" option, the output incorrectly shows "Anterolisthesis present" in the generated report. The underlying logic must be corrected.

Constraint

Focus on JSON and Dynamic Logic: Any changes must prioritize shifting logic from code to JSON. The final codebase must be clean, maintainable, and demonstrably capable of handling dynamic study additions without further code modification.