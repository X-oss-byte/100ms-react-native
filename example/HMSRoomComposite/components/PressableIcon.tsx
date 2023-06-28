import * as React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import {COLORS} from '../utils/theme';

interface PressableIconProps extends Omit<TouchableOpacityProps, 'children'> {
  children: Pick<TouchableOpacityProps, 'children'>;
  rounded?: boolean;
  border?: boolean;
}

export const PressableIcon: React.FC<PressableIconProps> = ({
  children,
  style,
  rounded = false,
  border = true,
  ...restProps
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.pressable,
        {
          borderRadius: rounded ? 20 : undefined,
          ...(border ? styles.withBorder : undefined),
        },
        style,
      ]}
      {...restProps}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pressable: {
    padding: 8,
    alignSelf: 'flex-start',
  },
  withBorder: {
    borderRadius: 8,
    borderColor: COLORS.BORDER.BRIGHT,
    borderWidth: 1,
  },
});