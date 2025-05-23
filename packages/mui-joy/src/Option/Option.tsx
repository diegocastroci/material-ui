import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/base/composeClasses';
import { useOption } from '@mui/base/OptionUnstyled';
import { useSlotProps } from '@mui/base/utils';
import { StyledListItemButton } from '../ListItemButton/ListItemButton';
import { styled, useThemeProps } from '../styles';
import { useColorInversion } from '../styles/ColorInversion';
import { OptionOwnerState, ExtendOption, OptionTypeMap } from './OptionProps';
import optionClasses, { getOptionUtilityClass } from './optionClasses';
import RowListContext from '../List/RowListContext';

const useUtilityClasses = (ownerState: OptionOwnerState) => {
  const { disabled, highlighted, selected } = ownerState;

  const slots = {
    root: ['root', disabled && 'disabled', highlighted && 'highlighted', selected && 'selected'],
  };

  return composeClasses(slots, getOptionUtilityClass, {});
};

const OptionRoot = styled(StyledListItemButton as unknown as 'button', {
  name: 'JoyOption',
  slot: 'Root',
  overridesResolver: (props, styles) => styles.root,
})<{ ownerState: OptionOwnerState }>(({ theme, ownerState }) => {
  const variantStyle = theme.variants[`${ownerState.variant!}Hover`]?.[ownerState.color!];
  return {
    [`&.${optionClasses.highlighted}`]: {
      backgroundColor: variantStyle?.backgroundColor,
    },
  };
});

const Option = React.forwardRef(function Option(inProps, ref) {
  const props = useThemeProps<typeof inProps & { component?: React.ElementType }>({
    props: inProps,
    name: 'JoyOption',
  });

  const {
    component = 'li',
    children,
    disabled = false,
    value,
    label,
    variant = 'plain',
    color: colorProp = 'neutral',
    ...other
  } = props;

  const row = React.useContext(RowListContext);

  const { getRootProps, selected, highlighted, index } = useOption({
    disabled,
    value,
    optionRef: ref,
  });

  const { getColor } = useColorInversion(variant);
  const color = getColor(inProps.color, selected ? 'primary' : colorProp);

  const ownerState = {
    ...props,
    disabled,
    selected,
    highlighted,
    index,
    component,
    variant,
    color,
    row,
  };

  const classes = useUtilityClasses(ownerState);

  const rootProps = useSlotProps({
    getSlotProps: getRootProps,
    elementType: OptionRoot,
    externalSlotProps: {},
    externalForwardedProps: other,
    additionalProps: {
      as: component,
    },
    className: classes.root,
    ownerState,
  });

  return <OptionRoot {...rootProps}>{children}</OptionRoot>;
}) as ExtendOption<OptionTypeMap>;

Option.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // |     To update them edit TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The content of the component.
   */
  children: PropTypes.node,
  /**
   * The color of the component. It supports those theme colors that make sense for this component.
   * @default 'neutral'
   */
  color: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['danger', 'info', 'neutral', 'primary', 'success', 'warning']),
    PropTypes.string,
  ]),
  /**
   * The component used for the root node.
   * Either a string to use a HTML element or a component.
   */
  component: PropTypes.elementType,
  /**
   * If `true`, the component is disabled.
   * @default false
   */
  disabled: PropTypes.bool,
  /**
   * A text representation of the option's content.
   * Used for keyboard text navigation matching.
   */
  label: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The option value.
   */
  value: PropTypes.any,
  /**
   * The variant to use.
   * @default 'plain'
   */
  variant: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    PropTypes.oneOf(['outlined', 'plain', 'soft', 'solid']),
    PropTypes.string,
  ]),
} as any;

export default Option;
