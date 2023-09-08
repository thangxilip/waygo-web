const {
  GridToolbarContainer,
  GridToolbarExport,
  GridToolbarDensitySelector,
} = require("@mui/x-data-grid");

const ExportToolBar = () => (
  <GridToolbarContainer>
    <GridToolbarDensitySelector />
    <GridToolbarExport csvOptions={{ disableToolbarButton: true }} />
  </GridToolbarContainer>
);

export default ExportToolBar;
