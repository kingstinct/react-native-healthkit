#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

/// Registers the launch-time observer setup without any AppDelegate changes.
///
/// `+load` runs when the binary is loaded, before `main`. It subscribes to
/// UIApplicationDidFinishLaunchingNotification, which UIKit posts synchronously
/// right after `application(_:didFinishLaunchingWithOptions:)` returns and
/// before the run loop continues, so observer queries are still registered
/// during launch as HealthKit background delivery requires. The manager is
/// looked up by name at runtime: importing this pod's Swift module from the
/// app's AppDelegate would drag NitroModules' C++ headers into a target
/// compiled without C++ interop and fail to build.
@interface HealthKitBackgroundLaunchHook : NSObject
@end

@implementation HealthKitBackgroundLaunchHook

+ (void)load {
  [[NSNotificationCenter defaultCenter]
      addObserverForName:UIApplicationDidFinishLaunchingNotification
                  object:nil
                   queue:nil
              usingBlock:^(NSNotification *_Nonnull note) {
                Class managerClass = NSClassFromString(@"BackgroundDeliveryManager");
                SEL sharedSelector = NSSelectorFromString(@"shared");
                SEL setupSelector = NSSelectorFromString(@"setupBackgroundObservers");
                if (managerClass == nil || ![managerClass respondsToSelector:sharedSelector]) {
                  return;
                }
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Warc-performSelector-leaks"
                id shared = [managerClass performSelector:sharedSelector];
                if ([shared respondsToSelector:setupSelector]) {
                  [shared performSelector:setupSelector];
                }
#pragma clang diagnostic pop
              }];
}

@end
