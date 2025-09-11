import { useState, useEffect } from "react";
import * as Location from "expo-location";

interface ILocation {
  latitude: number;
  longitude: number;
}

interface IUseCurrentLocation {
  location: ILocation | null;
  errorMsg: string | null;
  refreshLocation: Function;
}

export default function useCurrentLocation(): IUseCurrentLocation {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [trigger, setTrigger] = useState<boolean>(true);

  const refreshLocation = () => {
    setTrigger((c) => !c);
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Location Permission Denied");
        return;
      }

      try {
        const { coords } = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      } catch (error) {
        setErrorMsg("Cannot Get Location");
        console.error(error);
      }
    })();
  }, [trigger]);

  return { location, errorMsg, refreshLocation };
}
