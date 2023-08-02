import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  Platform,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  InteractionManager,
} from 'react-native';
import {
  HMSAudioMixingMode,
  HMSUpdateListenerActions,
} from '@100mslive/react-native-hms';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-simple-toast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import { openSettings, requestNotifications } from 'react-native-permissions';

import { COLORS } from '../utils/theme';
import type { RootState } from '../redux';
import {
  changePipModeStatus,
  changeEnableHLSPlayerControls,
  changeShowHLSStats,
  changeShowCustomHLSPlayerControls,
} from '../redux/actions';
import { ModalTypes, PipModes } from '../utils/types';
import { parseMetadata } from '../utils/functions';
import { HMSShareScreen } from './HMSShareScreen';
import { ScreenShareIcon } from '../Icons';

interface RoomSettingsModalContentProps {
  newAudioMixingMode: HMSAudioMixingMode;
  isAudioShared: boolean;
  audioDeviceListenerAdded: boolean;
  muteAllTracksAudio: boolean;
  closeRoomSettingsModal(): void;
  setModalVisible(modalType: ModalTypes, delay?: boolean): void;
  setIsAudioShared(state: boolean): void;
  setAudioDeviceListenerAdded(state: boolean): void;
  setMuteAllTracksAudio(state: boolean): void;
}

export const RoomSettingsModalContent: React.FC<
  RoomSettingsModalContentProps
> = ({
  newAudioMixingMode,
  isAudioShared, //
  audioDeviceListenerAdded,
  muteAllTracksAudio,
  closeRoomSettingsModal,
  setModalVisible,
  setIsAudioShared,
  setAudioDeviceListenerAdded,
  setMuteAllTracksAudio,
}) => {
  // REDUX STATES & DISPATCH
  const dispatch = useDispatch();
  const hmsInstance = useSelector((state: RootState) => state.user.hmsInstance);
  const debugMode = useSelector((state: RootState) => state.user.debugMode);
  const localPeerRole = useSelector(
    (state: RootState) => state.hmsStates.localPeer?.role
  );
  const localPeerMetadata = useSelector(
    (state: RootState) => state.hmsStates.localPeer?.metadata
  );
  const isHLSStreaming = useSelector(
    (state: RootState) =>
      state.hmsStates.room?.hlsStreamingState?.running ?? false
  );
  const rtmpAndRecording = useSelector(
    (state: RootState) =>
      state.hmsStates.room?.browserRecordingState?.running ?? false
  );

  const pipModeStatus = useSelector(
    (state: RootState) => state.app.pipModeStatus
  );
  const showHLSStats = useSelector(
    (state: RootState) => state.app.joinConfig.showHLSStats
  );
  const enableHLSPlayerControls = useSelector(
    (state: RootState) => state.app.joinConfig.enableHLSPlayerControls
  );
  const showCustomHLSPlayerControls = useSelector(
    (state: RootState) => state.app.joinConfig.showCustomHLSPlayerControls
  );

  // CONSTANTS
  const parsedMetadata = parseMetadata(localPeerMetadata);
  const isPipModeUnavailable = pipModeStatus === PipModes.NOT_AVAILABLE;

  //#region FUNCTIONS
  const handleBRB = async () => {
    closeRoomSettingsModal();

    await hmsInstance
      ?.changeMetadata(
        JSON.stringify({
          ...parsedMetadata,
          isBRBOn: !parsedMetadata?.isBRBOn,
          isHandRaised: false,
        })
      )
      .then((d) => console.log('Change Metadata Success: ', d))
      .catch((e) => console.log('Change Metadata Error: ', e));
  };

  const onRaiseHandPress = async () => {
    closeRoomSettingsModal();

    await hmsInstance
      ?.changeMetadata(
        JSON.stringify({
          ...parsedMetadata,
          isHandRaised: !parsedMetadata?.isHandRaised,
          isBRBOn: false,
        })
      )
      .then((d) => console.log('Change Metadata Success: ', d))
      .catch((e) => console.log('Change Metadata Error: ', e));
  };

  const onParticipantsPress = () => {
    InteractionManager.runAfterInteractions(() => {
      setModalVisible(ModalTypes.PARTICIPANTS, true);
    });
  };

  const enterPipMode = async () => {
    if (isPipModeUnavailable) {
      return console.log('PIP mode unavailable on Deice!');
    }

    closeRoomSettingsModal();

    try {
      const isEnabled = await hmsInstance?.enablePipMode({
        aspectRatio: [16, 9], // for 16:9 aspect ratio
        endButton: true,
        videoButton: true,
        audioButton: true,
      });
      if (isEnabled === true) {
        dispatch(changePipModeStatus(PipModes.ACTIVE));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLocalRemoteAudiosMute = () => {
    closeRoomSettingsModal();
    hmsInstance?.setPlaybackForAllAudio(!muteAllTracksAudio);
    setMuteAllTracksAudio(!muteAllTracksAudio);
  };

  const handleRemoteAudiosMute = async () => {
    closeRoomSettingsModal();
    await hmsInstance
      ?.remoteMuteAllAudio()
      .then((d) => console.log('Remote Mute All Audio Success: ', d))
      .catch((e) => console.log('Remote Mute All Audio Error: ', e));
  };

  const handleHLSStreaming = () => {
    if (isHLSStreaming) {
      closeRoomSettingsModal();
      hmsInstance
        ?.stopHLSStreaming()
        .then((d) => console.log('Stop HLS Streaming Success: ', d))
        .catch((e) => console.log('Stop HLS Streaming Error: ', e));
    } else {
      setModalVisible(ModalTypes.HLS_STREAMING, true);
    }
  };

  const handleRTMPAndRecording = () => {
    if (rtmpAndRecording) {
      closeRoomSettingsModal();
      hmsInstance
        ?.stopRtmpAndRecording()
        .then((d) => console.log('Stop RTMP And Recording Success: ', d))
        .catch((e) => console.log('Stop RTMP And Recording Error: ', e));
    } else {
      setModalVisible(ModalTypes.RECORDING, true);
    }
  };

  const addRemoveAudioDeviceChangeListener = () => {
    closeRoomSettingsModal();
    if (hmsInstance) {
      if (audioDeviceListenerAdded) {
        setAudioDeviceListenerAdded(false);

        hmsInstance.removeEventListener(
          HMSUpdateListenerActions.ON_AUDIO_DEVICE_CHANGED
        );
      } else {
        setAudioDeviceListenerAdded(true);

        hmsInstance.setAudioDeviceChangeListener((data: any) => {
          Toast.showWithGravity(
            `Audio Device Output changed to ${data?.device}`,
            Toast.LONG,
            Toast.TOP
          );
        });
      }
    }
  };

  const changeBulkRole = () =>
    setModalVisible(ModalTypes.BULK_ROLE_CHANGE, true);

  const changeTrackState = () =>
    setModalVisible(ModalTypes.CHANGE_TRACK_ROLE, true);

  const switchAudioOutput = () => {
    if (Platform.OS === 'android') {
      setModalVisible(ModalTypes.SWITCH_AUDIO_OUTPUT, true);
    } else {
      closeRoomSettingsModal();
      hmsInstance?.switchAudioOutputUsingIOSUI();
    }
  };

  const changeAudioMode = () =>
    setModalVisible(ModalTypes.CHANGE_AUDIO_MODE, true);

  const setAudioMixingMode = () =>
    setModalVisible(ModalTypes.AUDIO_MIXING_MODE, true);

  const handleHLSPlayerAspectRatio = () => {
    setModalVisible(ModalTypes.HLS_PLAYER_ASPECT_RATIO, true);
  };

  const showRTCStats = () => setModalVisible(ModalTypes.RTC_STATS, true);

  const toggleShowHLSStats = () => {
    dispatch(changeShowHLSStats(!showHLSStats));
    setModalVisible(ModalTypes.DEFAULT);
  };

  const toggleEnableHLSPlayerControls = () => {
    dispatch(changeEnableHLSPlayerControls(!enableHLSPlayerControls));
    setModalVisible(ModalTypes.DEFAULT);
  };

  const toggleShowCustomHLSPlayerControls = () => {
    dispatch(changeShowCustomHLSPlayerControls(!showCustomHLSPlayerControls));
    setModalVisible(ModalTypes.DEFAULT);
  };

  // Android Audioshare
  const handleAudioShare = async () => {
    closeRoomSettingsModal();
    if (isAudioShared) {
      hmsInstance
        ?.stopAudioshare()
        .then((d) => {
          setIsAudioShared(false);
          console.log('Stop Audioshare Success: ', d);
        })
        .catch((e) => console.log('Stop Audioshare Error: ', e));
    } else {
      // check notification permission on android platform
      // Audio share feature needs foreground service running. for Foreground service to keep running, we need active notification.
      if (Platform.OS === 'android') {
        const result = await requestNotifications(['alert', 'sound']);

        console.log('Notification Permission Result: ', result);

        if (result.status === 'blocked') {
          Alert.alert(
            'Notification Permission is Blocked!',
            '100ms SDK needs notification permission to start audio share. Please allow notification from settings and try again!',
            [
              { text: 'cancel' },
              { text: 'Go to Settings', onPress: () => openSettings() },
            ],
            { cancelable: true }
          );
          return;
        }
      }

      hmsInstance
        ?.startAudioshare(newAudioMixingMode)
        .then((d) => {
          setIsAudioShared(true);
          console.log('Start Audioshare Success: ', d);
        })
        .catch((e) => console.log('Start Audioshare Error: ', e));
    }
  };
  //#endregion

  return (
    <View style={styles.container}>
      <View style={styles.chatHeaderContainer}>
        <Text style={styles.chatHeading}>More Options</Text>
      </View>

      <ScrollView
        style={styles.contentContainer}
        contentContainerStyle={styles.scrollContentContainer}
      >
        <HMSShareScreen
          screenShareDelegate={
            <ScreenShareDelegate
              closeRoomSettingsModal={closeRoomSettingsModal}
            />
          }
        />

        <TouchableOpacity onPress={handleBRB} style={styles.button}>
          <Image source={require('../assets/brb.png')} style={styles.brbIcon} />

          <Text style={styles.text}>
            {parsedMetadata?.isBRBOn ? 'Remove BRB' : 'Set BRB'}
          </Text>
        </TouchableOpacity>

        <SettingItem
          onPress={onRaiseHandPress}
          text={parsedMetadata?.isHandRaised ? 'Low Your Hand' : 'Raise Hand'}
          IconType={Ionicons}
          iconName={'hand-left-outline'}
        />

        <SettingItem
          onPress={onParticipantsPress}
          text={'Participants'}
          IconType={Ionicons}
          iconName={'people'}
        />

        {localPeerRole?.name?.includes('hls-') ? (
          <SettingItem
            onPress={handleHLSPlayerAspectRatio}
            text={'Change Aspect Ratio'}
            IconType={MaterialCommunityIcons}
            iconName={'aspect-ratio'}
          />
        ) : null}

        {!localPeerRole?.name?.includes('hls-') ? (
          <SettingItem
            onPress={handleLocalRemoteAudiosMute}
            text={`${muteAllTracksAudio ? 'Unmute' : 'Mute'} Room`}
            IconType={Ionicons}
            iconName={muteAllTracksAudio ? 'mic-off-outline' : 'mic-outline'}
          />
        ) : null}

        {debugMode && localPeerRole?.permissions?.hlsStreaming ? (
          <SettingItem
            onPress={handleHLSStreaming}
            text={`${isHLSStreaming === true ? 'Stop' : 'Start'} HLS Streaming`}
            IconType={Ionicons}
            iconName="radio-outline"
          />
        ) : null}

        {debugMode && localPeerRole?.permissions?.rtmpStreaming ? (
          <SettingItem
            onPress={handleRTMPAndRecording}
            text={
              rtmpAndRecording === true
                ? 'Stop RTMP And Recording'
                : 'Start RTMP or Recording'
            }
            IconType={Ionicons}
            iconName="recording-outline"
          />
        ) : null}

        {debugMode && localPeerRole?.permissions?.changeRole ? (
          <SettingItem
            onPress={changeBulkRole}
            text="Bulk Role Change"
            IconType={Ionicons}
            iconName="people-outline"
          />
        ) : null}

        {debugMode && localPeerRole?.permissions?.mute ? (
          <SettingItem
            onPress={handleRemoteAudiosMute}
            text="Remote Mute All Audio Tracks"
            IconType={Ionicons}
            iconName="mic-off-outline"
          />
        ) : null}

        {debugMode &&
        (localPeerRole?.permissions?.mute ||
          localPeerRole?.permissions?.unmute) ? (
          <SettingItem
            onPress={changeTrackState}
            text="Change Track State For Role"
            IconType={MaterialIcons}
            iconName="track-changes"
          />
        ) : null}

        {localPeerRole?.publishSettings?.allowed?.includes('audio') ? (
          <SettingItem
            onPress={switchAudioOutput}
            text="Switch Audio Output"
            IconType={MaterialCommunityIcons}
            iconName="cast-audio"
          />
        ) : null}

        {!isPipModeUnavailable ? (
          <SettingItem
            onPress={enterPipMode}
            text="Picture in Picture (PIP) Mode"
            IconType={MaterialCommunityIcons}
            iconName="picture-in-picture-bottom-right"
          />
        ) : null}

        {debugMode ? (
          <>
            {localPeerRole?.name?.includes('hls-') ? (
              <>
                <SettingItem
                  onPress={toggleShowHLSStats}
                  text={showHLSStats ? 'Hide HLS Stats' : 'Show HLS Stats'}
                  IconType={MaterialCommunityIcons}
                  iconName={'clipboard-pulse-outline'}
                />

                <SettingItem
                  onPress={toggleEnableHLSPlayerControls}
                  text={
                    enableHLSPlayerControls
                      ? 'Disable HLS Player Controls'
                      : 'Enable HLS Player Controls'
                  }
                  IconType={Ionicons}
                  iconName={'ios-settings-outline'}
                />

                <SettingItem
                  onPress={toggleShowCustomHLSPlayerControls}
                  text={
                    showCustomHLSPlayerControls
                      ? 'Hide Custom HLS Player Controls'
                      : 'Show Custom HLS Player Controls'
                  }
                  IconType={Ionicons}
                  iconName={'ios-settings-outline'}
                />
              </>
            ) : (
              <>
                <SettingItem
                  onPress={showRTCStats}
                  text="Show RTC Stats"
                  IconType={MaterialCommunityIcons}
                  iconName={'clipboard-pulse-outline'}
                />
              </>
            )}

            {Platform.OS === 'android' &&
            localPeerRole?.publishSettings?.allowed?.includes('audio') ? (
              <>
                <SettingItem
                  onPress={addRemoveAudioDeviceChangeListener}
                  text={`${
                    audioDeviceListenerAdded ? 'Remove' : 'Set'
                  } Audio Output Change Listener`}
                  IconType={MaterialCommunityIcons}
                  iconName="video-input-component"
                />

                <SettingItem
                  onPress={handleAudioShare}
                  text={`${isAudioShared ? 'Stop' : 'Start'} Audioshare`}
                  IconType={Ionicons}
                  iconName="share-social-outline"
                />

                <SettingItem
                  onPress={changeAudioMode}
                  text="Set Audio Mode"
                  IconType={MaterialCommunityIcons}
                  iconName="call-split"
                />

                <SettingItem
                  onPress={setAudioMixingMode}
                  text="Set Audio Mixing Mode"
                  IconType={EntypoIcons}
                  iconName="sound-mix"
                />
              </>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
};

interface SettingItemProps {
  onPress(): void;
  text: string;
  iconName: string;
  IconType: any;
}

const SettingItem: React.FC<SettingItemProps> = ({
  onPress,
  text,
  iconName,
  IconType,
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <IconType name={iconName} size={24} style={styles.icon} />

      <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  );
};

const ScreenShareDelegate = ({
  isLocalScreenShared,
  onPress,
  closeRoomSettingsModal,
}: any) => {
  const handleScreenSharePress = () => {
    closeRoomSettingsModal();
    onPress?.();
  };

  return (
    <TouchableOpacity onPress={handleScreenSharePress} style={styles.button}>
      <ScreenShareIcon style={styles.icon} />
      <Text style={styles.text}>
        {isLocalScreenShared ? 'Stop Screen Share' : 'Screen Share'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    backgroundColor: COLORS.SURFACE.DEFAULT,
  },
  chatHeaderContainer: {
    height: 48,
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatHeading: {
    fontFamily: 'Inter-Medium',
    fontSize: 20,
    lineHeight: 24,
    letterSpacing: 0.15,
    color: COLORS.TEXT.HIGH_EMPHASIS,
    paddingRight: 12,
  },
  contentContainer: {
    flex: 1,
    marginVertical: 4,
  },
  scrollContentContainer: {
    paddingBottom: 52,
  },
  brbIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.WHITE,
    marginRight: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 24,
    color: COLORS.TEXT.HIGH_EMPHASIS,
  },
  icon: {
    color: COLORS.WHITE,
    marginRight: 12,
  },
});