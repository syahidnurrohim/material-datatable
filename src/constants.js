
// Class Name definition
export const className = {
  MDCWrapper: 'mdc-data-table',
  MDCTable: 'mdc-data-table__table',
  MDCContent: 'mdc-data-table__content',
  MDCTableContainer: 'mdc-data-table__table-container',
  MDCCell: 'mdc-data-table__cell',
  MDCCellNumeric: 'mdc-data-table__cell--numeric',
  MDCRow: 'mdc-data-table__row',
  MDCHeaderCell: 'mdc-data-table__header-cell',
  MDCHeaderCellNumeric: 'mdc-data-table__header-cell--numeric',
  MDCHeaderRow: 'mdc-data-table__header-row',
  MDCMenu: 'mdc-menu',
  MDCMenuSurface: 'mdc-menu-surface',
  MDCMenuSurfaceFullWidth: 'mdc-menu-surface--fullwidth',
  MDCSelect: 'mdc-select',
  MDCSelectAnchor: 'mdc-select__anchor',
  MDCSelectOutlined: 'mdc-select--outlined',
  MDCSelectNoLabel: 'mdc-select--no-label',
  MDCSelectMenu: 'mdc-select__menu',
  MDCSelectDropdownIcon: 'mdc-select__dropdown-icon',
  MDCSelectedTextContainer: 'mdc-select__selected-text-container',
  MDCSelectedText: 'mdc-select__selected-text',
  MDCNotchedOutline: 'mdc-notched-outline',
  MDCNotchedOutlineNotched: 'mdc-notched-outline--notched',
  MDCNotchedOutlineNotch: 'mdc-notched-outline__notch',
  MDCNotchedOutlineLeading: 'mdc-notched-outline__leading',
  MDCNotchedOutlineTrailing: 'mdc-notched-outline__trailing',
  MDCIconButton: 'mdc-icon-button',
  MDCIcon: 'mdc-icon',
  MDCButtonIcon: 'mdc-button__icon',
  MDCList: 'mdc-list',
  MDCListDense: 'mdc-list--dense',
  MDCLi: 'mdc-list-item',
  MDCLiSelected: 'mdc-list-item--selected',
  MDCLiText: 'mdc-list-item__text',
  MDCPagination: 'mdc-data-table__pagination',
  MDCPaginationButton: 'mdc-data-table__pagination-button',
  MDCPaginationNavigation: 'mdc-data-table__pagination-navigation',
  MDCPaginationNavigationTotal: 'mdc-data-table__pagination-total',
  MDCPaginationTrailing: 'mdc-data-table__pagination-trailing',
  MDCPaginationRPP: 'mdc-data-table__pagination-rows-per-page',
  MDCPaginationRPPLabel: 'mdc-data-table__pagination-rows-per-page-label',
  MDCPaginationRPPSelect: 'mdc-data-table__pagination-rows-per-page-select',
  MaterialIcons: 'material-icons',
  MDCTextField: 'mdc-text-field',
  MDCTextFieldInput: 'mdc-text-field__input',
  MDCTextFieldOutlined: 'mdc-text-field--outlined',
  MDCFloatingLabel: 'mdc-floating-label',
}

// More than 1 class names definition
export const classNameGroup = {
  selectRPPGroup: [
    className.MDCSelect,
    className.MDCSelectOutlined,
    className.MDCSelectNoLabel,
    className.MDCPaginationRPPSelect
  ],
  spanNotchedGroup: [
    className.MDCNotchedOutline,
    className.MDCNotchedOutlineNotched
  ],
  selectRPPMenuGroup: [
    className.MDCSelectMenu,
    className.MDCMenu,
    className.MDCMenuSurface,
    className.MDCMenuSurfaceFullWidth
  ],
  footNavigationGroup: [
    className.MDCIconButton,
    className.MaterialIcons,
    className.MDCPaginationButton
  ],
  listRPPGroup: [
    className.MDCList,
    className.MDCListDense
  ]
}

// Styles definition
export const style = {
  searchWrapper: {
    padding: '0.5em',
    borderBottom: '1px solid rgba(0,0,0,.1)'
  },
  searchInput: {
    padding: '0.75em 1.5em',
    border: '1px solid rgba(0,0,0,.1)',
    borderRadius: '4px',
    float: 'right',
    width: '16em',
    fontSize: '0.875rem'
  },
  selectAnchor: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  paginationWrapper: {
    padding: '0 1em'
  },
  triangleDown: {
    position: 'relative',
    top: '-5px',
    content: "",
    display: 'inline-block',
    width: '15px',
    height: '15px',
    borderRight: '0.2em solid black',
    borderTop: '0.2em solid black',
    transform: 'rotate(135deg)',
    marginRight: '0.5em',
    marginLeft: '1.0em'
  },
  triangleUp: {
    position: 'relative',
    top: '-5px',
    content: "",
    display: 'inline-block',
    width: '15px',
    height: '15px',
    borderRight: '0.2em solid black',
    borderTop: '0.2em solid black',
    transform: 'rotate(-45deg)',
    marginRight: '0.5em',
    marginLeft: '1.0em'
  },
  arrowHeader: {
    marginLeft: '0.25em',
    transform: 'translateY(0.25em)'
  }
}