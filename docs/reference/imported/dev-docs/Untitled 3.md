##### 9.4.1.2 Ports as the basis of an object-capability model on the web[](https://html.spec.whatwg.org/multipage/web-messaging.html#ports-as-the-basis-of-an-object-capability-model-on-the-web)

_This section is non-normative._

Ports can be viewed as a way to expose limited capabilities (in the object-capability model sense) to other actors in the system. This can either be a weak capability system, where the ports are merely used as a convenient model within a particular origin, or as a strong capability model, where they are provided by one origin provider as the only mechanism by which another origin consumer can effect change in or obtain information from provider.

For example, consider a situation in which a social web site embeds in one `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)` the user's email contacts provider (an address book site, from a second origin), and in a second `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)` a game (from a third origin). The outer social site and the game in the second `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)` cannot access anything inside the first `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)`; together they can only:

- [Navigate](https://html.spec.whatwg.org/multipage/browsing-the-web.html#navigate) the `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)` to a new [URL](https://url.spec.whatwg.org/#concept-url), such as the same [URL](https://url.spec.whatwg.org/#concept-url) but with a different [fragment](https://url.spec.whatwg.org/#concept-url-fragment), causing the `[Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)` in the `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)` to receive a `[hashchange](https://html.spec.whatwg.org/multipage/indices.html#event-hashchange)` event.
    
- Resize the `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)`, causing the `[Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)` in the `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)` to receive a `[resize](https://drafts.csswg.org/cssom-view/#eventdef-window-resize)` event.
    
- Send a `[message](https://html.spec.whatwg.org/multipage/indices.html#event-message)` event to the `[Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)` in the `[iframe](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-iframe-element)` using the `[window.postMessage()](https://html.spec.whatwg.org/multipage/web-messaging.html#dom-window-postmessage)` API.
    

The contacts provider can use these methods, most particularly the third one, to provide an API that can be accessed by other origins to manipulate the user's address book. For example, it could respond to a message "`add-contact Guillaume Tell <tell@pomme.example.net>`" by adding the given person and email address to the user's address book.

To avoid any site on the web being able to manipulate the user's contacts, the contacts provider might only allow certain trusted sites, such as the social site, to do this.

Now suppose the game wanted to add a contact to the user's address book, and that the social site was willing to allow it to do so on its behalf, essentially "sharing" the trust that the contacts provider had with the social site. There are several ways it could do this; most simply, it could just proxy messages between the game site and the contacts site. However, this solution has a number of difficulties: it requires the social site to either completely trust the game site not to abuse the privilege, or it requires that the social site verify each request to make sure it's not a request that it doesn't want to allow (such as adding multiple contacts, reading the contacts, or deleting them); it also requires some additional complexity if there's ever the possibility of multiple games simultaneously trying to interact with the contacts provider.

Using message channels and `[MessagePort](https://html.spec.whatwg.org/multipage/web-messaging.html#messageport)` objects, however, all of these problems can go away. When the game tells the social site that it wants to add a contact, the social site can ask the contacts provider not for it to add a contact, but for the _capability_ to add a single contact. The contacts provider then creates a pair of `[MessagePort](https://html.spec.whatwg.org/multipage/web-messaging.html#messageport)` objects, and sends one of them back to the social site, who forwards it on to the game. The game and the contacts provider then have a direct connection, and the contacts provider knows to only honor a single "add contact" request, nothing else. In other words, the game has been granted the capability to add a single contact.

---

#### 6.10.2 Close watcher infrastructure[](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-infrastructure)

Each `[Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)` has a close watcher manager, which is a [struct](https://infra.spec.whatwg.org/#struct) with the following [items](https://infra.spec.whatwg.org/#struct-item):

- Groups, a [list](https://infra.spec.whatwg.org/#list) of [lists](https://infra.spec.whatwg.org/#list) of [close watchers](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher), initially empty.
    
- Allowed number of groups, a number, initially 1.
    
- Next user interaction allows a new group, a boolean, initially true.
    

Most of the complexity of the [close watcher manager](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager) comes from anti-abuse protections designed to prevent developers from disabling users' history traversal abilities, for platforms where a [close request](https://html.spec.whatwg.org/multipage/interaction.html#close-request)'s [fallback action](https://html.spec.whatwg.org/multipage/interaction.html#close-request-fallback) is the main mechanism of history traversal. In particular:

The grouping of [close watchers](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher) is designed so that if multiple close watchers are created without [history-action activation](https://html.spec.whatwg.org/multipage/interaction.html#history-action-activation), they are grouped together, so that a user-triggered [close request](https://html.spec.whatwg.org/multipage/interaction.html#close-request) will close all of the close watchers in a group. This ensures that web developers can't intercept an unlimited number of close requests by creating close watchers; instead they can create a number equal to at most 1 + the number of times the [user activates the page](https://html.spec.whatwg.org/multipage/interaction.html#tracking-user-activation).

The [next user interaction allows a new group](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-next) boolean encourages web developers to create [close watchers](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher) in a way that is tied to individual [user activations](https://html.spec.whatwg.org/multipage/interaction.html#tracking-user-activation). Without it, each user activation would increase the [allowed number of groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-allowed-number-of-groups), even if the web developer isn't "using" those user activations to create close watchers. In short:

- Allowed: user interaction; create a close watcher in its own group; user interaction; create a close watcher in a second independent group.
    
- Disallowed: user interaction; user interaction; create a close watcher in its own group; create a close watcher in a second independent group.
    
- Allowed: user interaction; user interaction; create a close watcher in its own group; create a close watcher grouped with the previous one.
    

This protection is _not_ important for upholding our desired invariant of creating at most (1 + the number of times the [user activates the page](https://html.spec.whatwg.org/multipage/interaction.html#tracking-user-activation)) groups. A determined abuser will just create one close watcher per user interaction, "banking" them for future abuse. But this system causes more predictable behavior for the normal case, and encourages non-abusive developers to create close watchers directly in response to user interactions.

To notify the close watcher manager about user activation given a `[Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)` window:

1. Let manager be window's [close watcher manager](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager).
    
2. If manager's [next user interaction allows a new group](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-next) is true, then increment manager's [allowed number of groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-allowed-number-of-groups).
    
3. Set manager's [next user interaction allows a new group](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-next) to false.
    

---

A close watcher is a [struct](https://infra.spec.whatwg.org/#struct) with the following [items](https://infra.spec.whatwg.org/#struct-item):

- A window, a `[Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)`.
    
- A cancel action, an algorithm accepting a boolean argument and returning a boolean. The argument indicates whether or not the cancel action algorithm can prevent the close request from proceeding via the algorithm's return value. If the boolean argument is true, then the algorithm can return either true to indicate that the caller will proceed to the [close action](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-close-action), or false to indicate that the caller will bail out. If the argument is false, then the return value is always false. This algorithm can never throw an exception.
    
- A close action, an algorithm accepting no arguments and returning nothing. This algorithm can never throw an exception.
    
- An is running cancel action boolean.
    
- A get enabled state, an algorithm accepting no arguments and returning a boolean. This algorithm can never throw an exception.
    

A [close watcher](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher) closeWatcher is active if closeWatcher's [window](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-window)'s [close watcher manager](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager) [contains](https://infra.spec.whatwg.org/#list-contain) any list which [contains](https://infra.spec.whatwg.org/#list-contain) closeWatcher.

---

To establish a close watcher given a `[Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)` window, a list of steps cancelAction, a list of steps closeAction, and an algorithm that returns a boolean getEnabledState:

1. [Assert](https://infra.spec.whatwg.org/#assert): window's [associated `Document`](https://html.spec.whatwg.org/multipage/nav-history-apis.html#concept-document-window) is [fully active](https://html.spec.whatwg.org/multipage/document-sequences.html#fully-active).
    
2. Let closeWatcher be a new [close watcher](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher), with
    
    [window](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-window)
    
    window
    
    [cancel action](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-cancel-action)
    
    cancelAction
    
    [close action](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-close-action)
    
    closeAction
    
    [is running cancel action](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-is-running-cancel)
    
    false
    
    [get enabled state](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-get-enabled-state)
    
    getEnabledState
    
3. Let manager be window's [close watcher manager](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager).
    
4. If manager's [groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-groups)'s [size](https://infra.spec.whatwg.org/#list-size) is less than manager's [allowed number of groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-allowed-number-of-groups), then [append](https://infra.spec.whatwg.org/#list-append) « closeWatcher » to manager's [groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-groups).
    
5. Otherwise:
    
    1. [Assert](https://infra.spec.whatwg.org/#assert): manager's [groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-groups)'s [size](https://infra.spec.whatwg.org/#list-size) is at least 1 in this branch, since manager's [allowed number of groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-allowed-number-of-groups) is always at least 1.
        
    2. [Append](https://infra.spec.whatwg.org/#list-append) closeWatcher to manager's [groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-groups)'s last [item](https://infra.spec.whatwg.org/#list-item).
        
6. Set manager's [next user interaction allows a new group](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-next) to true.
    
7. Return closeWatcher.
    

To request to close a [close watcher](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher) closeWatcher with boolean requireHistoryActionActivation:

1. If closeWatcher [is not active](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-active), then return true.
    
2. If the result of running closeWatcher's [get enabled state](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-get-enabled-state) is false, then return true.
    
3. If closeWatcher's [is running cancel action](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-is-running-cancel) is true, then return true.
    
4. Let window be closeWatcher's [window](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-window).
    
5. If window's [associated `Document`](https://html.spec.whatwg.org/multipage/nav-history-apis.html#concept-document-window) is not [fully active](https://html.spec.whatwg.org/multipage/document-sequences.html#fully-active), then return true.
    
6. Let canPreventClose be true if requireHistoryActionActivation is false, or if window's [close watcher manager](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager)'s [groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-groups)'s [size](https://infra.spec.whatwg.org/#list-size) is less than window's [close watcher manager](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager)'s [allowed number of groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-allowed-number-of-groups), and window has [history-action activation](https://html.spec.whatwg.org/multipage/interaction.html#history-action-activation); otherwise false.
    
7. Set closeWatcher's [is running cancel action](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-is-running-cancel) to true.
    
8. Let shouldContinue be the result of running closeWatcher's [cancel action](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-cancel-action) given canPreventClose.
    
9. Set closeWatcher's [is running cancel action](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-is-running-cancel) to false.
    
10. If shouldContinue is false, then:
    
    1. [Assert](https://infra.spec.whatwg.org/#assert): canPreventClose is true.
        
    2. [Consume history-action user activation](https://html.spec.whatwg.org/multipage/interaction.html#consume-history-action-user-activation) given window.
        
    3. Return false.
        
    
    Note that since these substeps [consume history-action user activation](https://html.spec.whatwg.org/multipage/interaction.html#consume-history-action-user-activation), [requesting to close](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-request-close) a [close watcher](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher) twice without any intervening [user activation](https://html.spec.whatwg.org/multipage/interaction.html#tracking-user-activation) will result in canPreventClose being false the second time.
    
11. [Close](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-close) closeWatcher.
    
12. Return true.
    

To close a [close watcher](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher) closeWatcher:

1. If closeWatcher [is not active](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-active), then return.
    
2. If the result of running closeWatcher's [get enabled state](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-get-enabled-state) is false, then return.
    
3. If closeWatcher's [window](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-window)'s [associated `Document`](https://html.spec.whatwg.org/multipage/nav-history-apis.html#concept-document-window) is not [fully active](https://html.spec.whatwg.org/multipage/document-sequences.html#fully-active), then return.
    
4. [Destroy](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-destroy) closeWatcher.
    
5. Run closeWatcher's [close action](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-close-action).
    

To destroy a [close watcher](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher) closeWatcher:

1. Let manager be closeWatcher's [window](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-window)'s [close watcher manager](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager).
    
2. [For each](https://infra.spec.whatwg.org/#list-iterate) group of manager's [groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-groups): [remove](https://infra.spec.whatwg.org/#list-remove) closeWatcher from group.
    
3. [Remove](https://infra.spec.whatwg.org/#list-remove) any item from manager's [groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-groups) that [is empty](https://infra.spec.whatwg.org/#list-is-empty).
    

---

To process close watchers given a `[Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)` window:

1. Let processedACloseWatcher be false.
    
2. If window's [close watcher manager](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager)'s [groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-groups) is not empty:
    
    1. Let group be the last [item](https://infra.spec.whatwg.org/#list-item) in window's [close watcher manager](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager)'s [groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-groups).
        
    2. [For each](https://infra.spec.whatwg.org/#list-iterate) closeWatcher of group, in reverse order:
        
        1. If the result of running closeWatcher's [get enabled state](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-get-enabled-state) is true, set processedACloseWatcher to true.
            
        2. Let shouldProceed be the result of [requesting to close](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-request-close) closeWatcher with true.
            
        3. If shouldProceed is false, then [break](https://infra.spec.whatwg.org/#iteration-break).
            
3. If window's [close watcher manager](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager)'s [allowed number of groups](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-manager-allowed-number-of-groups) is greater than 1, decrement it by 1.
    
4. Return processedACloseWatcher.
    

#### 6.10.3 The `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` interface[](https://html.spec.whatwg.org/multipage/interaction.html#the-closewatcher-interface)

```
[Exposed=Window]
interface CloseWatcher : EventTarget {
  constructor(optional CloseWatcherOptions options = {});

  undefined requestClose();
  undefined close();
  undefined destroy();

  attribute EventHandler oncancel;
  attribute EventHandler onclose;
};

dictionary CloseWatcherOptions {
  AbortSignal signal;
};
```

`watcher = new [CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher)()`

`watcher = new [CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher)({ [signal](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcheroptions-signal) })`

Creates a new `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` instance.

If the `[signal](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcheroptions-signal)` option is provided, then watcher can be destroyed (as if by `[watcher.destroy()](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-destroy)`) by aborting the given `[AbortSignal](https://dom.spec.whatwg.org/#abortsignal)`.

If any [close watcher](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher) is already active, and the `[Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)` does not have [history-action activation](https://html.spec.whatwg.org/multipage/interaction.html#history-action-activation), then the resulting `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` will be closed together with that already-active [close watcher](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher) in response to any [close request](https://html.spec.whatwg.org/multipage/interaction.html#close-request). (This already-active [close watcher](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher) does not necessarily have to be a `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` object; it could be a modal `[dialog](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element)` element, or a popover generated by an element with the `[popover](https://html.spec.whatwg.org/multipage/popover.html#attr-popover)` attribute.)

`watcher.[requestClose](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-requestclose)()`

Acts as if a [close request](https://html.spec.whatwg.org/multipage/interaction.html#close-request) was sent targeting watcher, by first firing a `[cancel](https://html.spec.whatwg.org/multipage/indices.html#event-cancel)` event, and if that event is not canceled with `[preventDefault()](https://dom.spec.whatwg.org/#dom-event-preventdefault)`, proceeding to fire a `[close](https://html.spec.whatwg.org/multipage/indices.html#event-close)` event before deactivating the close watcher as if `[watcher.destroy()](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-destroy)` was called.

This is a helper utility that can be used to consolidate cancelation and closing logic into the `[cancel](https://html.spec.whatwg.org/multipage/indices.html#event-cancel)` and `[close](https://html.spec.whatwg.org/multipage/indices.html#event-close)` event handlers, by having all non-[close request](https://html.spec.whatwg.org/multipage/interaction.html#close-request) closing affordances call this method.

`watcher.[close](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-close)()`

Immediately fires the `[close](https://html.spec.whatwg.org/multipage/indices.html#event-close)` event, and then deactivates the close watcher as if `[watcher.destroy()](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-destroy)` was called.

This is a helper utility that can be used trigger the closing logic into the `[close](https://html.spec.whatwg.org/multipage/indices.html#event-close)` event handler, skipping any logic in the `[cancel](https://html.spec.whatwg.org/multipage/indices.html#event-cancel)` event handler.

`watcher.[destroy](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-destroy)()`

Deactivates watcher, so that it will no longer receive `[close](https://html.spec.whatwg.org/multipage/indices.html#event-close)` events and so that new independent `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` instances can be constructed.

This is intended to be called if the relevant UI element is torn down in some other way than being closed.

Each `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` instance has an internal close watcher, which is a [close watcher](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher).

The `new CloseWatcher(options)` constructor steps are:

1. If [this](https://webidl.spec.whatwg.org/#this)'s [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global)'s [associated `Document`](https://html.spec.whatwg.org/multipage/nav-history-apis.html#concept-document-window) is not [fully active](https://html.spec.whatwg.org/multipage/document-sequences.html#fully-active), then throw an ["`InvalidStateError`"](https://webidl.spec.whatwg.org/#invalidstateerror) `[DOMException](https://webidl.spec.whatwg.org/#dfn-DOMException)`.
    
2. Let closeWatcher be the result of [establishing a close watcher](https://html.spec.whatwg.org/multipage/interaction.html#establish-a-close-watcher) given [this](https://webidl.spec.whatwg.org/#this)'s [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global), with:
    
    - _[cancelAction](https://html.spec.whatwg.org/multipage/interaction.html#create-close-watcher-cancelaction)_ given canPreventClose being to return the result of [firing an event](https://dom.spec.whatwg.org/#concept-event-fire) named `[cancel](https://html.spec.whatwg.org/multipage/indices.html#event-cancel)` at [this](https://webidl.spec.whatwg.org/#this), with the `[cancelable](https://dom.spec.whatwg.org/#dom-event-cancelable)` attribute initialized to canPreventClose.
        
    - _[closeAction](https://html.spec.whatwg.org/multipage/interaction.html#create-close-watcher-closeaction)_ being to [fire an event](https://dom.spec.whatwg.org/#concept-event-fire) named `[close](https://html.spec.whatwg.org/multipage/indices.html#event-close)` at [this](https://webidl.spec.whatwg.org/#this).
        
    - _[getEnabledState](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-get-enabled-state)_ being to return true.
        
3. If options["`[signal](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcheroptions-signal)`"] [exists](https://infra.spec.whatwg.org/#map-exists), then:
    
    1. If options["`[signal](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcheroptions-signal)`"] is [aborted](https://dom.spec.whatwg.org/#abortsignal-aborted), then [destroy](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-destroy) closeWatcher.
        
    2. [Add](https://dom.spec.whatwg.org/#abortsignal-add) the following steps to options["`[signal](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcheroptions-signal)`"]:
        
        1. [Destroy](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-destroy) closeWatcher.
            
4. Set [this](https://webidl.spec.whatwg.org/#this)'s [internal close watcher](https://html.spec.whatwg.org/multipage/interaction.html#internal-close-watcher) to closeWatcher.
    

The `requestClose()` method steps are to [request to close](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-request-close) [this](https://webidl.spec.whatwg.org/#this)'s [internal close watcher](https://html.spec.whatwg.org/multipage/interaction.html#internal-close-watcher) with false.

The `close()` method steps are to [close](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-close) [this](https://webidl.spec.whatwg.org/#this)'s [internal close watcher](https://html.spec.whatwg.org/multipage/interaction.html#internal-close-watcher).

The `destroy()` method steps are to [destroy](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher-destroy) [this](https://webidl.spec.whatwg.org/#this)'s [internal close watcher](https://html.spec.whatwg.org/multipage/interaction.html#internal-close-watcher).

The following are the [event handlers](https://html.spec.whatwg.org/multipage/webappapis.html#event-handlers) (and their corresponding [event handler event types](https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-event-type)) that must be supported, as [event handler IDL attributes](https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-idl-attributes), by all objects implementing the `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` interface:

|[Event handler](https://html.spec.whatwg.org/multipage/webappapis.html#event-handlers)|[Event handler event type](https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-event-type)|
|---|---|
|`oncancel`|`[cancel](https://html.spec.whatwg.org/multipage/indices.html#event-cancel)`|
|`onclose`|`[close](https://html.spec.whatwg.org/multipage/indices.html#event-close)`|

[](https://html.spec.whatwg.org/multipage/interaction.html#example-CloseWatcher-basic)

If one wanted to implement a custom picker control, which closed itself on a user-provided [close request](https://html.spec.whatwg.org/multipage/interaction.html#close-request) as well as when a close button is pressed, the following code shows how one would use the `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` API to process close requests:

```
const watcher = new CloseWatcher();
const picker = setUpAndShowPickerDOMElement();

let chosenValue = null;

watcher.onclose = () => {
  chosenValue = picker.querySelector('input').value;
  picker.remove();
};

picker.querySelector('.close-button').onclick = () => watcher.requestClose();
```

Note how the logic to gather the chosen value is centralized in the `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` object's `[close](https://html.spec.whatwg.org/multipage/indices.html#event-close)` event handler, with the `[click](https://w3c.github.io/pointerevents/#click)` event handler for the close button delegating to that logic by calling `[requestClose()](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-requestclose)`.

[](https://html.spec.whatwg.org/multipage/interaction.html#example-CloseWatcher-cancel)

The `[cancel](https://html.spec.whatwg.org/multipage/indices.html#event-cancel)` event on `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` objects can be used to prevent the `[close](https://html.spec.whatwg.org/multipage/indices.html#event-close)` event from firing, and the `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` from being destroying. A typical use case is as follows:

```
watcher.oncancel = async (e) => {
  if (hasUnsavedData && e.cancelable) {
    e.preventDefault();

    const userReallyWantsToClose = await askForConfirmation("Are you sure you want to close?");
    if (userReallyWantsToClose) {
      hasUnsavedData = false;
      watcher.close();
    }
  }
};
```

For abuse prevention purposes, this event is only `[cancelable](https://dom.spec.whatwg.org/#dom-event-cancelable)` if the page has [history-action activation](https://html.spec.whatwg.org/multipage/interaction.html#history-action-activation), which will be lost after any given [close request](https://html.spec.whatwg.org/multipage/interaction.html#close-request). This ensures that if the user sends a close request twice in a row without any intervening user activation, the request definitely succeeds; the second request ignores any `[cancel](https://html.spec.whatwg.org/multipage/indices.html#event-cancel)` event handler's attempt to call `[preventDefault()](https://dom.spec.whatwg.org/#dom-event-preventdefault)` and proceeds to close the `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)`.

Combined, the above two examples show how `[requestClose()](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-requestclose)` and `[close()](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-close)` differ. Because we used `[requestClose()](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-requestclose)` in the `[click](https://w3c.github.io/pointerevents/#click)` event handler for the close button, clicking that button will trigger the `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)`'s `[cancel](https://html.spec.whatwg.org/multipage/indices.html#event-cancel)` event, and thus potentially ask the user for confirmation if there is unsaved data. If we had used `[close()](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-close)`, then this check would be skipped. Sometimes that is appropriate, but usually `[requestClose()](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-requestclose)` is the better option for user-triggered close requests.

[](https://html.spec.whatwg.org/multipage/interaction.html#example-CloseWatcher-grouping)

In addition to the [user activation](https://html.spec.whatwg.org/multipage/interaction.html#tracking-user-activation) restrictions for `[cancel](https://html.spec.whatwg.org/multipage/indices.html#event-cancel)` events, there is a more subtle form of user activation gating for `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` construction. If one creates more than one `[CloseWatcher](https://html.spec.whatwg.org/multipage/interaction.html#closewatcher)` without user activation, then the newly-created one will get grouped together with the most-recently-created [close watcher](https://html.spec.whatwg.org/multipage/interaction.html#close-watcher), so that a single [close request](https://html.spec.whatwg.org/multipage/interaction.html#close-request) will close them both:

```
window.onload = () => {
  // This will work as normal: it is the first close watcher created without user activation.
  (new CloseWatcher()).onclose = () => { /* ... */ };
};

button1.onclick = () => {
  // This will work as normal: the button click counts as user activation.
  (new CloseWatcher()).onclose = () => { /* ... */ };
};

button2.onclick = () => {
  // These will be grouped together, and both will close in response to a single close request.
  (new CloseWatcher()).onclose = () => { /* ... */ };
  (new CloseWatcher()).onclose = () => { /* ... */ };
};
```

This means that calling `[destroy()](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-destroy)`, `[close()](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-close)`, or `[requestClose()](https://html.spec.whatwg.org/multipage/interaction.html#dom-closewatcher-requestclose)` properly is important. Doing so is the only way to get back the "free" ungrouped close watcher slot. Such close watchers created without user activation are useful for cases like session inactivity timeout dialogs or urgent notifications of server-triggered events, which are not generated in response to user activation.


---

To make an element draggable, give the element a `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable)` attribute, and set an event listener for `[dragstart](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragstart)` that stores the data being dragged.

The event handler typically needs to check that it's not a text selection that is being dragged, and then needs to store data into the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object and set the allowed effects (copy, move, link, or some combination).

For example:

```
<p>What fruits do you like?</p>
<ol ondragstart="dragStartHandler(event)">
 <li draggable="true" data-value="fruit-apple">Apples</li>
 <li draggable="true" data-value="fruit-orange">Oranges</li>
 <li draggable="true" data-value="fruit-pear">Pears</li>
</ol>
<script>
  var internalDNDType = 'text/x-example'; // set this to something specific to your site
  function dragStartHandler(event) {
    if (event.target instanceof HTMLLIElement) {
      // use the element's data-value="" attribute as the value to be moving:
      event.dataTransfer.setData(internalDNDType, event.target.dataset.value);
      event.dataTransfer.effectAllowed = 'move'; // only allow moves
    } else {
      event.preventDefault(); // don't allow selection to be dragged
    }
  }
</script>
```

---

To accept a drop, the drop target has to listen to the following events:

1. The `[dragenter](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragenter)` event handler reports whether or not the drop target is potentially willing to accept the drop, by canceling the event.
2. The `[dragover](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragover)` event handler specifies what feedback will be shown to the user, by setting the `[dropEffect](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect)` attribute of the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` associated with the event. This event also needs to be canceled.
3. The `[drop](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-drop)` event handler has a final chance to accept or reject the drop. If the drop is accepted, the event handler must perform the drop operation on the target. This event needs to be canceled, so that the `[dropEffect](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect)` attribute's value can be used by the source. Otherwise, the drop operation is rejected.

For example:

```
<p>Drop your favorite fruits below:</p>
<ol ondragenter="dragEnterHandler(event)" ondragover="dragOverHandler(event)"
    ondrop="dropHandler(event)">
</ol>
<script>
  var internalDNDType = 'text/x-example'; // set this to something specific to your site
  function dragEnterHandler(event) {
    var items = event.dataTransfer.items;
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      if (item.kind == 'string' && item.type == internalDNDType) {
        event.preventDefault();
        return;
      }
    }
  }
  function dragOverHandler(event) {
    event.dataTransfer.dropEffect = 'move';
    event.preventDefault();
  }
  function dropHandler(event) {
    var li = document.createElement('li');
    var data = event.dataTransfer.getData(internalDNDType);
    if (data == 'fruit-apple') {
      li.textContent = 'Apples';
    } else if (data == 'fruit-orange') {
      li.textContent = 'Oranges';
    } else if (data == 'fruit-pear') {
      li.textContent = 'Pears';
    } else {
      li.textContent = 'Unknown Fruit';
    }
    event.target.appendChild(li);
  }
</script>
```

---

To remove the original element (the one that was dragged) from the display, the `[dragend](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragend)` event can be used.

For our example here, that means updating the original markup to handle that event:

```
<p>What fruits do you like?</p>
<ol ondragstart="dragStartHandler(event)" ondragend="dragEndHandler(event)">
 ...as before...
</ol>
<script>
  function dragStartHandler(event) {
    // ...as before...
  }
  function dragEndHandler(event) {
    if (event.dataTransfer.dropEffect == 'move') {
      // remove the dragged element
      event.target.parentNode.removeChild(event.target);
    }
  }
</script>
```

#### 6.11.2 The drag data store[](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-store)

The data that underlies a drag-and-drop operation, known as the drag data store, consists of the following information:

- A drag data store item list, which is a list of items representing the dragged data, each consisting of the following information:
    
    The drag data item kind
    
    The kind of data:
    
    _Text_
    
    Text.
    
    _File_
    
    Binary data with a filename.
    
    The drag data item type string
    
    A Unicode string giving the type or format of the data, generally given by a [MIME type](https://mimesniff.spec.whatwg.org/#mime-type). Some values that are not [MIME types](https://mimesniff.spec.whatwg.org/#mime-type) are special-cased for legacy reasons. The API does not enforce the use of [MIME types](https://mimesniff.spec.whatwg.org/#mime-type); other values can be used as well. In all cases, however, the values are all [converted to ASCII lowercase](https://infra.spec.whatwg.org/#ascii-lowercase) by the API.
    
    There is a limit of one _text_ item per [item type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string).
    
    The actual data
    
    A Unicode or binary string, in some cases with a filename (itself a Unicode string), as per [the drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind).
    
    The [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) is ordered in the order that the items were added to the list; most recently added last.
    
- The following information, used to generate the UI feedback during the drag:
    
    - User-agent-defined default feedback information, known as the drag data store default feedback.
    - Optionally, a bitmap image and the coordinate of a point within that image, known as the drag data store bitmap and drag data store hot spot coordinate.
- A drag data store mode, which is one of the following:
    
    Read/write mode
    
    For the `[dragstart](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragstart)` event. New data can be added to the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store).
    
    Read-only mode
    
    For the `[drop](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-drop)` event. The list of items representing dragged data can be read, including the data. No new data can be added.
    
    Protected mode
    
    For all other events. The formats and kinds in the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store) list of items representing dragged data can be enumerated, but the data itself is unavailable and no new data can be added.
    
- A drag data store allowed effects state, which is a string.
    

When a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store) is created, it must be initialized such that its [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) is empty, it has no [drag data store default feedback](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-default-feedback), it has no [drag data store bitmap](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-bitmap) and [drag data store hot spot coordinate](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-hot-spot-coordinate), its [drag data store mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode) is [protected mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p), and its [drag data store allowed effects state](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-allowed-effects-state) is the string "`[uninitialized](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized)`".

#### 6.11.3 The `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` interface[](https://html.spec.whatwg.org/multipage/dnd.html#the-datatransfer-interface)

**✔**MDN

`[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` objects are used to expose the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store) that underlies a drag-and-drop operation.

```
[Exposed=Window]
interface DataTransfer {
  constructor();

  attribute DOMString dropEffect;
  attribute DOMString effectAllowed;

  [SameObject] readonly attribute DataTransferItemList items;

  undefined setDragImage(Element image, long x, long y);

  /* old interface */
  readonly attribute FrozenArray<DOMString> types;
  DOMString getData(DOMString format);
  undefined setData(DOMString format, DOMString data);
  undefined clearData(optional DOMString format);
  [SameObject] readonly attribute FileList files;
};
```

`dataTransfer = new [DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer)()`

**✔**MDN

Creates a new `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object with an empty [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store).

`dataTransfer.[dropEffect](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect) [ = value ]`

**✔**MDN

Returns the kind of operation that is currently selected. If the kind of operation isn't one of those that is allowed by the `[effectAllowed](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed)` attribute, then the operation will fail.

Can be set, to change the selected operation.

The possible values are "`[none](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-none)`", "`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy)`", "`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link)`", and "`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move)`".

`dataTransfer.[effectAllowed](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed) [ = value ]`

**✔**MDN

Returns the kinds of operations that are to be allowed.

Can be set (during the `[dragstart](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragstart)` event), to change the allowed operations.

The possible values are "`[none](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-none)`", "`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copy)`", "`[copyLink](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copylink)`", "`[copyMove](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copymove)`", "`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-link)`", "`[linkMove](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-linkmove)`", "`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-move)`", "`[all](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-all)`", and "`[uninitialized](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized)`",

`dataTransfer.[items](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-items)`

**✔**MDN

Returns a `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object, with the drag data.

`dataTransfer.[setDragImage](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-setdragimage)(element, x, y)`

**✔**MDN

Uses the given element to update the drag feedback, replacing any previously specified feedback.

`dataTransfer.[types](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-types)`

**✔**MDN

Returns a [frozen array](https://webidl.spec.whatwg.org/#dfn-frozen-array-type) listing the formats that were set in the `[dragstart](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragstart)` event. In addition, if any files are being dragged, then one of the types will be the string "`Files`".

`data = dataTransfer.[getData](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-getdata)(format)`

**✔**MDN

Returns the specified data. If there is no such data, returns the empty string.

`dataTransfer.[setData](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-setdata)(format, data)`

**✔**MDN

Adds the specified data.

`dataTransfer.[clearData](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-cleardata)([ format ])`

**✔**MDN

Removes the data of the specified formats. Removes all data if the argument is omitted.

`dataTransfer.[files](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-files)`

**✔**MDN

Returns a `[FileList](https://w3c.github.io/FileAPI/#filelist-section)` of the files being dragged, if any.

`[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` objects that are created as part of [drag-and-drop events](https://html.spec.whatwg.org/multipage/dnd.html#dndevents) are only valid while those events are being fired.

A `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is associated with a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store) while it is valid.

A `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object has an associated types array, which is a `[FrozenArray<DOMString>](https://webidl.spec.whatwg.org/#dfn-frozen-array-type)`, initially empty. When the contents of the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object's [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) change, or when the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object becomes no longer associated with a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store), run the following steps:

1. Let L be an empty sequence.
    
2. If the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is still associated with a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store), then:
    
    1. For each item in the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object's [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) whose [kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _text_, add an entry to L consisting of the item's [type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string).
        
    2. If there are any items in the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object's [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) whose [kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _File_, then add an entry to L consisting of the string "`Files`". (This value can be distinguished from the other values because it is not lowercase.)
        
3. Set the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object's [types array](https://html.spec.whatwg.org/multipage/dnd.html#concept-datatransfer-types) to the result of [creating a frozen array](https://webidl.spec.whatwg.org/#dfn-create-frozen-array) from L.
    

The `DataTransfer()` constructor, when invoked, must return a newly created `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object initialized as follows:

1. Set the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store)'s [item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) to be an empty list.
    
2. Set the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store)'s [mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode) to [read/write mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw).
    
3. Set the `[dropEffect](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect)` and `[effectAllowed](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed)` to "none".
    

The `dropEffect` attribute controls the drag-and-drop feedback that the user is given during a drag-and-drop operation. When the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is created, the `[dropEffect](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect)` attribute is set to a string value. On getting, it must return its current value. On setting, if the new value is one of "`none`", "`copy`", "`link`", or "`move`", then the attribute's current value must be set to the new value. Other values must be ignored.

The `effectAllowed` attribute is used in the drag-and-drop processing model to initialize the `[dropEffect](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect)` attribute during the `[dragenter](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragenter)` and `[dragover](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragover)` events. When the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is created, the `[effectAllowed](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed)` attribute is set to a string value. On getting, it must return its current value. On setting, if the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store)'s [mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode) is the [read/write mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw) and the new value is one of "`none`", "`copy`", "`copyLink`", "`copyMove`", "`link`", "`linkMove`", "`move`", "`all`", or "`uninitialized`", then the attribute's current value must be set to the new value. Otherwise, it must be left unchanged.

The `items` attribute must return a `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object associated with the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object.

The `setDragImage(image, x, y)` method must run the following steps:

1. If the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is no longer associated with a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store), return. Nothing happens.
    
2. If the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store)'s [mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode) is not the [read/write mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw), return. Nothing happens.
    
3. If image is an `[img](https://html.spec.whatwg.org/multipage/embedded-content.html#the-img-element)` element, then set the [drag data store bitmap](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-bitmap) to the element's image (at its [natural size](https://drafts.csswg.org/css-images/#natural-dimensions)); otherwise, set the [drag data store bitmap](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-bitmap) to an image generated from the given element (the exact mechanism for doing so is not currently specified).
    
4. Set the [drag data store hot spot coordinate](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-hot-spot-coordinate) to the given x, y coordinate.
    

The `types` attribute must return this `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object's [types array](https://html.spec.whatwg.org/multipage/dnd.html#concept-datatransfer-types).

The `getData(format)` method must run the following steps:

1. If the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is no longer associated with a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store), then return the empty string.
    
2. If the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store)'s [mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode) is the [protected mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p), then return the empty string.
    
3. Let format be the first argument, [converted to ASCII lowercase](https://infra.spec.whatwg.org/#ascii-lowercase).
    
4. Let convert-to-URL be false.
    
5. If format equals "`text`", change it to "`text/plain`".
    
6. If format equals "`url`", change it to "`text/uri-list`" and set convert-to-URL to true.
    
7. If there is no item in the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) whose [kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _text_ and whose [type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) is equal to format, return the empty string.
    
8. Let result be the data of the item in the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) whose [kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _Plain Unicode string_ and whose [type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) is equal to format.
    
9. If convert-to-URL is true, then parse result as appropriate for `text/uri-list` data, and then set result to the first URL from the list, if any, or the empty string otherwise. [[RFC2483]](https://html.spec.whatwg.org/multipage/references.html#refsRFC2483)
    
10. Return result.
    

The `setData(format, data)` method must run the following steps:

1. If the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is no longer associated with a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store), return. Nothing happens.
    
2. If the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store)'s [mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode) is not the [read/write mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw), return. Nothing happens.
    
3. Let format be the first argument, [converted to ASCII lowercase](https://infra.spec.whatwg.org/#ascii-lowercase).
    
4. If format equals "`text`", change it to "`text/plain`".
    
    If format equals "`url`", change it to "`text/uri-list`".
    
5. Remove the item in the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) whose [kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _text_ and whose [type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) is equal to format, if there is one.
    
6. Add an item to the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) whose [kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _text_, whose [type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) is equal to format, and whose data is the string given by the method's second argument.
    

The `clearData(format)` method must run the following steps:

1. If the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is no longer associated with a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store), return. Nothing happens.
    
2. If the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store)'s [mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode) is not the [read/write mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw), return. Nothing happens.
    
3. If the method was called with no arguments, remove each item in the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) whose [kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _Plain Unicode string_, and return.
    
4. Set format to format, [converted to ASCII lowercase](https://infra.spec.whatwg.org/#ascii-lowercase).
    
5. If format equals "`text`", change it to "`text/plain`".
    
    If format equals "`url`", change it to "`text/uri-list`".
    
6. Remove the item in the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) whose [kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _text_ and whose [type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) is equal to format, if there is one.
    

The `[clearData()](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-cleardata)` method does not affect whether any files were included in the drag, so the `[types](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-types)` attribute's list might still not be empty after calling `[clearData()](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-cleardata)` (it would still contain the "`Files`" string if any files were included in the drag).

The `files` attribute must return a [live](https://html.spec.whatwg.org/multipage/infrastructure.html#live) `[FileList](https://w3c.github.io/FileAPI/#filelist-section)` sequence consisting of `[File](https://w3c.github.io/FileAPI/#dfn-file)` objects representing the files found by the following steps. Furthermore, for a given `[FileList](https://w3c.github.io/FileAPI/#filelist-section)` object and a given underlying file, the same `[File](https://w3c.github.io/FileAPI/#dfn-file)` object must be used each time.

1. Start with an empty list L.
    
2. If the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is no longer associated with a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store), the `[FileList](https://w3c.github.io/FileAPI/#filelist-section)` is empty. Return the empty list L.
    
3. If the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store)'s [mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode) is the [protected mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p), return the empty list L.
    
4. For each item in the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) whose [kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _File_, add the item's data (the file, in particular its name and contents, as well as its [type](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string)) to the list L.
    
5. The files found by these steps are those in the list L.
    

This version of the API does not expose the types of the files during the drag.

##### 6.11.3.1 The `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` interface[](https://html.spec.whatwg.org/multipage/dnd.html#the-datatransferitemlist-interface)

**✔**MDN

Each `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is associated with a `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object.

```
[Exposed=Window]
interface DataTransferItemList {
  readonly attribute unsigned long length;
  getter DataTransferItem (unsigned long index);
  DataTransferItem? add(DOMString data, DOMString type);
  DataTransferItem? add(File data);
  undefined remove(unsigned long index);
  undefined clear();
};
```

`items.[length](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransferitemlist-length)`

**✔**MDN

Returns the number of items in the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store).

`items[index]`

Returns the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object representing the indexth entry in the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store).

`items.[remove](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransferitemlist-remove)(index)`

**✔**MDN

Removes the indexth entry in the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store).

`items.[clear](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransferitemlist-clear)()`

**✔**MDN

Removes all the entries in the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store).

`items.[add](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransferitemlist-add)(data)`

**✔**MDN

`items.[add](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransferitemlist-add)(data, type)`

Adds a new entry for the given data to the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store). If the data is plain text then a type string has to be provided also.

While the `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object's `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is associated with a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store), the `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object's _mode_ is the same as the [drag data store mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode). When the `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object's `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is _not_ associated with a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store), the `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object's _mode_ is the _disabled mode_. The [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store) referenced in this section (which is used only when the `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object is not in the _disabled mode_) is the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store) with which the `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object's `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is associated.

The `length` attribute must return zero if the object is in the _disabled mode_; otherwise it must return the number of items in the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list).

When a `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object is not in the _disabled mode_, its [supported property indices](https://webidl.spec.whatwg.org/#dfn-supported-property-indices) are the [indices](https://infra.spec.whatwg.org/#list-get-the-indices) of the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list).

To [determine the value of an indexed property](https://webidl.spec.whatwg.org/#dfn-determine-the-value-of-an-indexed-property) i of a `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object, the user agent must return a `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object representing the ith item in the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store). The same object must be returned each time a particular item is obtained from this `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object. The `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object must be associated with the same `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object as the `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object when it is first created.

The `add()` method must run the following steps:

1. If the `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object is not in the _[read/write mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw)_, return null.
    
2. Jump to the appropriate set of steps from the following list:
    
    If the first argument to the method is a string
    
    If there is already an item in the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) whose [kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _text_ and whose [type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) is equal to the value of the method's second argument, [converted to ASCII lowercase](https://infra.spec.whatwg.org/#ascii-lowercase), then throw a ["`NotSupportedError`"](https://webidl.spec.whatwg.org/#notsupportederror) `[DOMException](https://webidl.spec.whatwg.org/#dfn-DOMException)`.
    
    Otherwise, add an item to the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) whose [kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _text_, whose [type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) is equal to the value of the method's second argument, [converted to ASCII lowercase](https://infra.spec.whatwg.org/#ascii-lowercase), and whose data is the string given by the method's first argument.
    
    If the first argument to the method is a `[File](https://w3c.github.io/FileAPI/#dfn-file)`
    
    Add an item to the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) whose [kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _File_, whose [type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) is the `[type](https://w3c.github.io/FileAPI/#dfn-type)` of the `[File](https://w3c.github.io/FileAPI/#dfn-file)`, [converted to ASCII lowercase](https://infra.spec.whatwg.org/#ascii-lowercase), and whose data is the same as the `[File](https://w3c.github.io/FileAPI/#dfn-file)`'s data.
    
3. [Determine the value of the indexed property](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransferitemlist-item) corresponding to the newly added item, and return that value (a newly created `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object).
    

The `remove(index)` method must run these steps:

1. If the `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object is not in the _[read/write mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw)_, throw an ["`InvalidStateError`"](https://webidl.spec.whatwg.org/#invalidstateerror) `[DOMException](https://webidl.spec.whatwg.org/#dfn-DOMException)`.
    
2. If the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store) does not contain an indexth item, then return.
    
3. Remove the indexth item from the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store).
    

The `clear()` method, if the `[DataTransferItemList](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitemlist)` object is in the _[read/write mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw)_, must remove all the items from the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store). Otherwise, it must do nothing.

##### 6.11.3.2 The `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` interface[](https://html.spec.whatwg.org/multipage/dnd.html#the-datatransferitem-interface)

**✔**MDN

Each `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object is associated with a `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object.

```
[Exposed=Window]
interface DataTransferItem {
  readonly attribute DOMString kind;
  readonly attribute DOMString type;
  undefined getAsString(FunctionStringCallback? _callback);
  File? getAsFile();
};

callback FunctionStringCallback = undefined (DOMString data);
```

`item.[kind](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransferitem-kind)`

**✔**MDN

Returns [the drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind), one of: "string", "file".

`item.[type](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransferitem-type)`

**✔**MDN

Returns [the drag data item type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string).

`item.[getAsString](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransferitem-getasstring)(callback)`

**✔**MDN

Invokes the callback with the string data as the argument, if [the drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _text_.

`file = item.[getAsFile](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransferitem-getasfile)()`

**✔**MDN

Returns a `[File](https://w3c.github.io/FileAPI/#dfn-file)` object, if [the drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is _File_.

While the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object's `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is associated with a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store) and that [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store)'s [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) still contains the item that the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object represents, the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object's _mode_ is the same as the [drag data store mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode). When the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object's `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is _not_ associated with a [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store), or if the item that the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object represents has been removed from the relevant [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list), the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object's _mode_ is the _disabled mode_. The [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store) referenced in this section (which is used only when the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object is not in the _disabled mode_) is the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store) with which the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object's `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object is associated.

The `kind` attribute must return the empty string if the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object is in the _disabled mode_; otherwise it must return the string given in the cell from the second column of the following table from the row whose cell in the first column contains [the drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) of the item represented by the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object:

|Kind|String|
|---|---|
|_Text_|"`string`"|
|_File_|"`file`"|

The `type` attribute must return the empty string if the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object is in the _disabled mode_; otherwise it must return [the drag data item type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) of the item represented by the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object.

The `getAsString(callback)` method must run the following steps:

1. If the callback is null, return.
    
2. If the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object is not in the _[read/write mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw)_ or the _[read-only mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-ro)_, return. The callback is never invoked.
    
3. If [the drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is not _text_, then return. The callback is never invoked.
    
4. Otherwise, [queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) to invoke callback, passing the actual data of the item represented by the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object as the argument.
    

The `getAsFile()` method must run the following steps:

1. If the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object is not in the _[read/write mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw)_ or the _[read-only mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-ro)_, then return null.
    
2. If [the drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) is not _File_, then return null.
    
3. Return a new `[File](https://w3c.github.io/FileAPI/#dfn-file)` object representing the actual data of the item represented by the `[DataTransferItem](https://html.spec.whatwg.org/multipage/dnd.html#datatransferitem)` object.
    

#### 6.11.4 The `[DragEvent](https://html.spec.whatwg.org/multipage/dnd.html#dragevent)` interface[](https://html.spec.whatwg.org/multipage/dnd.html#the-dragevent-interface)

**✔**MDN

The drag-and-drop processing model involves several events. They all use the `[DragEvent](https://html.spec.whatwg.org/multipage/dnd.html#dragevent)` interface.

```
[Exposed=Window]
interface DragEvent : MouseEvent {
  constructor(DOMString type, optional DragEventInit eventInitDict = {});

  readonly attribute DataTransfer? dataTransfer;
};

dictionary DragEventInit : MouseEventInit {
  DataTransfer? dataTransfer = null;
};
```

`event.[dataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#dom-dragevent-datatransfer)`

**✔**MDN

Returns the `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object for the event.

Although, for consistency with other event interfaces, the `[DragEvent](https://html.spec.whatwg.org/multipage/dnd.html#dragevent)` interface has a constructor, it is not particularly useful. In particular, there's no way to create a useful `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object from script, as `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` objects have a processing and security model that is coordinated by the browser during drag-and-drops.

The `dataTransfer` attribute of the `[DragEvent](https://html.spec.whatwg.org/multipage/dnd.html#dragevent)` interface must return the value it was initialized to. It represents the context information for the event.

When a user agent is required to fire a DND event named e at an element, using a particular [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store), and optionally with a specific related target, the user agent must run the following steps:

1. Let dataDragStoreWasChanged be false.
2. If no specific related target was provided, set related target to null.
    
3. Let window be the [relevant global object](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-global) of the `[Document](https://html.spec.whatwg.org/multipage/dom.html#document)` object of the specified target element.
    
4. If e is `[dragstart](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragstart)`, then set the [drag data store mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode) to the [read/write mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw) and set dataDragStoreWasChanged to true.
    
    If e is `[drop](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-drop)`, set the [drag data store mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode) to the [read-only mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-ro).
    
5. Let dataTransfer be a newly created `[DataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#datatransfer)` object associated with the given [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store).
    
6. Set the `[effectAllowed](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed)` attribute to the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store)'s [drag data store allowed effects state](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-allowed-effects-state).
    
7. Set the `[dropEffect](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect)` attribute to "`[none](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-none)`" if e is `[dragstart](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragstart)`, `[drag](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-drag)`, or `[dragleave](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragleave)`; to the value corresponding to the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) if e is `[drop](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-drop)` or `[dragend](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragend)`; and to a value based on the `[effectAllowed](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed)` attribute's value and the drag-and-drop source, as given by the following table, otherwise (i.e. if e is `[dragenter](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragenter)` or `[dragover](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragover)`):
    
    |`[effectAllowed](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed)`|`[dropEffect](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect)`|
    |---|---|
    |"`[none](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-none)`"|"`[none](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-none)`"|
    |"`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copy)`"|"`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy)`"|
    |"`[copyLink](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copylink)`"|"`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy)`", or, [if appropriate](https://html.spec.whatwg.org/multipage/dnd.html#concept-platform-dropeffect-override), "`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link)`"|
    |"`[copyMove](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copymove)`"|"`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy)`", or, [if appropriate](https://html.spec.whatwg.org/multipage/dnd.html#concept-platform-dropeffect-override), "`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move)`"|
    |"`[all](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-all)`"|"`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy)`", or, [if appropriate](https://html.spec.whatwg.org/multipage/dnd.html#concept-platform-dropeffect-override), either "`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link)`" or "`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move)`"|
    |"`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-link)`"|"`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link)`"|
    |"`[linkMove](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-linkmove)`"|"`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link)`", or, [if appropriate](https://html.spec.whatwg.org/multipage/dnd.html#concept-platform-dropeffect-override), "`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move)`"|
    |"`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-move)`"|"`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move)`"|
    |"`[uninitialized](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized)`" when what is being dragged is a selection from a text control|"`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move)`", or, [if appropriate](https://html.spec.whatwg.org/multipage/dnd.html#concept-platform-dropeffect-override), either "`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy)`" or "`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link)`"|
    |"`[uninitialized](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized)`" when what is being dragged is a selection|"`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy)`", or, [if appropriate](https://html.spec.whatwg.org/multipage/dnd.html#concept-platform-dropeffect-override), either "`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link)`" or "`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move)`"|
    |"`[uninitialized](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized)`" when what is being dragged is an `[a](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element)` element with an `[href](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-href)` attribute|"`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link)`", or, [if appropriate](https://html.spec.whatwg.org/multipage/dnd.html#concept-platform-dropeffect-override), either "`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy)`" or "`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move)`"|
    |Any other case|"`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy)`", or, [if appropriate](https://html.spec.whatwg.org/multipage/dnd.html#concept-platform-dropeffect-override), either "`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link)`" or "`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move)`"|
    
    Where the table above provides possibly appropriate alternatives, user agents may instead use the listed alternative values if platform conventions dictate that the user has requested those alternate effects.
    
    For example, Windows platform conventions are such that dragging while holding the "alt" key indicates a preference for linking the data, rather than moving or copying it. Therefore, on a Windows system, if "`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link)`" is an option according to the table above while the "alt" key is depressed, the user agent could select that instead of "`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy)`" or "`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move)`".
    
8. Let event be the result of [creating an event](https://dom.spec.whatwg.org/#concept-event-create) using `[DragEvent](https://html.spec.whatwg.org/multipage/dnd.html#dragevent)`.
    
9. Initialize event's `[type](https://dom.spec.whatwg.org/#dom-event-type)` attribute to e, its `[bubbles](https://dom.spec.whatwg.org/#dom-event-bubbles)` attribute to true, its `[view](https://w3c.github.io/uievents/#dom-uievent-view)` attribute to window, its `[relatedTarget](https://w3c.github.io/pointerevents/#dom-mouseevent-relatedtarget)` attribute to related target, and its `[dataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#dom-dragevent-datatransfer)` attribute to dataTransfer.
    
10. If e is not `[dragleave](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragleave)` or `[dragend](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragend)`, then initialize event's `[cancelable](https://dom.spec.whatwg.org/#dom-event-cancelable)` attribute to true.
    
11. Initialize event's mouse and key attributes according to the state of the input devices as they would be for user interaction events.
    
    If there is no relevant pointing device, then initialize event's `screenX`, `screenY`, `[clientX](https://drafts.csswg.org/cssom-view/#dom-mouseevent-clientx)`, `[clientY](https://drafts.csswg.org/cssom-view/#dom-mouseevent-clienty)`, and `button` attributes to 0.
    
12. [Dispatch](https://dom.spec.whatwg.org/#concept-event-dispatch) event at the specified target element.
    
13. Set the [drag data store allowed effects state](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-allowed-effects-state) to the current value of dataTransfer's `[effectAllowed](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed)` attribute. (It can only have changed value if e is `[dragstart](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragstart)`.)
    
14. If dataDragStoreWasChanged is true, then set the [drag data store mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode) back to the [protected mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p).
    
15. Break the association between dataTransfer and the [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store).
    

#### 6.11.5 Processing model[](https://html.spec.whatwg.org/multipage/dnd.html#drag-and-drop-processing-model)

When the user attempts to begin a drag operation, the user agent must run the following steps. User agents must act as if these steps were run even if the drag actually started in another document or application and the user agent was not aware that the drag was occurring until it intersected with a document under the user agent's purview.

1. Determine what is being dragged, as follows:
    
    If the drag operation was invoked on a selection, then it is the selection that is being dragged.
    
    Otherwise, if the drag operation was invoked on a `[Document](https://html.spec.whatwg.org/multipage/dom.html#document)`, it is the first element, going up the ancestor chain, starting at the node that the user tried to drag, that has the IDL attribute `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#dom-draggable)` set to true. If there is no such element, then nothing is being dragged; return, the drag-and-drop operation is never started.
    
    Otherwise, the drag operation was invoked outside the user agent's purview. What is being dragged is defined by the document or application where the drag was started.
    
    `[img](https://html.spec.whatwg.org/multipage/embedded-content.html#the-img-element)` elements and `[a](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element)` elements with an `[href](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-href)` attribute have their `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#dom-draggable)` attribute set to true by default.
    
2. [Create a drag data store](https://html.spec.whatwg.org/multipage/dnd.html#create-a-drag-data-store). All the DND events fired subsequently by the steps in this section must use this [drag data store](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store).
    
3. Establish which DOM node is the source node, as follows:
    
    If it is a selection that is being dragged, then the [source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node) is the `[Text](https://dom.spec.whatwg.org/#interface-text)` node that the user started the drag on (typically the `[Text](https://dom.spec.whatwg.org/#interface-text)` node that the user originally clicked). If the user did not specify a particular node, for example if the user just told the user agent to begin a drag of "the selection", then the [source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node) is the first `[Text](https://dom.spec.whatwg.org/#interface-text)` node containing a part of the selection.
    
    Otherwise, if it is an element that is being dragged, then the [source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node) is the element that is being dragged.
    
    Otherwise, the [source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node) is part of another document or application. When this specification requires that an event be dispatched at the [source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node) in this case, the user agent must instead follow the platform-specific conventions relevant to that situation.
    
    Multiple events are fired on the [source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node) during the course of the drag-and-drop operation.
    
4. Determine the list of dragged nodes, as follows:
    
    If it is a selection that is being dragged, then the [list of dragged nodes](https://html.spec.whatwg.org/multipage/dnd.html#list-of-dragged-nodes) contains, in [tree order](https://dom.spec.whatwg.org/#concept-tree-order), every node that is partially or completely included in the selection (including all their ancestors).
    
    Otherwise, the [list of dragged nodes](https://html.spec.whatwg.org/multipage/dnd.html#list-of-dragged-nodes) contains only the [source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node), if any.
    
5. If it is a selection that is being dragged, then add an item to the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list), with its properties set as follows:
    
    [The drag data item type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string)
    
    "`[text/plain](https://www.rfc-editor.org/rfc/rfc2046#section-4.1.3)`"
    
    [The drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind)
    
    _Text_
    
    The actual data
    
    The text of the selection
    
    Otherwise, if any files are being dragged, then add one item per file to the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list), with their properties set as follows:
    
    [The drag data item type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string)
    
    The MIME type of the file, if known, or "`[application/octet-stream](https://www.rfc-editor.org/rfc/rfc2046#section-4.5.1)`" otherwise.
    
    [The drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind)
    
    _File_
    
    The actual data
    
    The file's contents and name.
    
    Dragging files can currently only happen from outside a [navigable](https://html.spec.whatwg.org/multipage/document-sequences.html#navigable), for example from a file system manager application.
    
    If the drag initiated outside of the application, the user agent must add items to the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) as appropriate for the data being dragged, honoring platform conventions where appropriate; however, if the platform conventions do not use [MIME types](https://mimesniff.spec.whatwg.org/#mime-type) to label dragged data, the user agent must make a best-effort attempt to map the types to MIME types, and, in any case, all the [drag data item type strings](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) must be [converted to ASCII lowercase](https://infra.spec.whatwg.org/#ascii-lowercase).
    
    User agents may also add one or more items representing the selection or dragged element(s) in other forms, e.g. as HTML.
    
6. If the [list of dragged nodes](https://html.spec.whatwg.org/multipage/dnd.html#list-of-dragged-nodes) is not empty, then [extract the microdata from those nodes into a JSON form](https://html.spec.whatwg.org/multipage/microdata.html#extracting-json), and add one item to the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list), with its properties set as follows:
    
    [The drag data item type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string)
    
    `[application/microdata+json](https://html.spec.whatwg.org/multipage/iana.html#application/microdata+json)`
    
    [The drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind)
    
    _Text_
    
    The actual data
    
    The resulting JSON string.
    
7. Run the following substeps:
    
    1. Let urls be « ».
        
    2. For each node in the [list of dragged nodes](https://html.spec.whatwg.org/multipage/dnd.html#list-of-dragged-nodes):
        
        If the node is an `[a](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element)` element with an `[href](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-href)` attribute
        
        Add to urls the result of [encoding-parsing-and-serializing a URL](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#encoding-parsing-and-serializing-a-url) given the element's `[href](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-href)` content attribute's value, relative to the element's [node document](https://dom.spec.whatwg.org/#concept-node-document).
        
        If the node is an `[img](https://html.spec.whatwg.org/multipage/embedded-content.html#the-img-element)` element with a `[src](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-src)` attribute
        
        Add to urls the result of [encoding-parsing-and-serializing a URL](https://html.spec.whatwg.org/multipage/urls-and-fetching.html#encoding-parsing-and-serializing-a-url) given the element's `[src](https://html.spec.whatwg.org/multipage/embedded-content.html#attr-img-src)` content attribute's value, relative to the element's [node document](https://dom.spec.whatwg.org/#concept-node-document).
        
    3. If urls is still empty, then return.
        
    4. Let url string be the result of concatenating the strings in urls, in the order they were added, separated by a U+000D CARRIAGE RETURN U+000A LINE FEED character pair (CRLF).
        
    5. Add one item to the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list), with its properties set as follows:
        
        [The drag data item type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string)
        
        `[text/uri-list](https://html.spec.whatwg.org/multipage/indices.html#text/uri-list)`
        
        [The drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind)
        
        _Text_
        
        The actual data
        
        url string
        
8. Update the [drag data store default feedback](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-default-feedback) as appropriate for the user agent (if the user is dragging the selection, then the selection would likely be the basis for this feedback; if the user is dragging an element, then that element's rendering would be used; if the drag began outside the user agent, then the platform conventions for determining the drag feedback should be used).
    
9. [Fire a DND event](https://html.spec.whatwg.org/multipage/dnd.html#fire-a-dnd-event) named `[dragstart](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragstart)` at the [source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node).
    
    If the event is canceled, then the drag-and-drop operation should not occur; return.
    
    Since events with no event listeners registered are, almost by definition, never canceled, drag-and-drop is always available to the user if the author does not specifically prevent it.
    
10. [Fire a pointer event](https://w3c.github.io/pointerevents/#dfn-fire-a-pointer-event) at the [source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node) named `[pointercancel](https://w3c.github.io/pointerevents/#the-pointercancel-event)`, and fire any other follow-up events as required by Pointer Events. [[POINTEREVENTS]](https://html.spec.whatwg.org/multipage/references.html#refsPOINTEREVENTS)
    
11. [Initiate the drag-and-drop operation](https://html.spec.whatwg.org/multipage/dnd.html#initiate-the-drag-and-drop-operation) in a manner consistent with platform conventions, and as described below.
    
    The drag-and-drop feedback must be generated from the first of the following sources that is available:
    
    1. The [drag data store bitmap](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-bitmap), if any. In this case, the [drag data store hot spot coordinate](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-hot-spot-coordinate) should be used as hints for where to put the cursor relative to the resulting image. The values are expressed as distances in [CSS pixels](https://drafts.csswg.org/css-values/#px) from the left side and from the top side of the image respectively. [[CSS]](https://html.spec.whatwg.org/multipage/references.html#refsCSS)
    2. The [drag data store default feedback](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-default-feedback).

From the moment that the user agent is to initiate the drag-and-drop operation, until the end of the drag-and-drop operation, device input events (e.g. mouse and keyboard events) must be suppressed.

During the drag operation, the element directly indicated by the user as the drop target is called the immediate user selection. (Only elements can be selected by the user; other nodes must not be made available as drop targets.) However, the [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) is not necessarily the current target element, which is the element currently selected for the drop part of the drag-and-drop operation.

The [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) changes as the user selects different elements (either by pointing at them with a pointing device, or by selecting them in some other way). The [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) changes when the [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) changes, based on the results of event listeners in the document, as described below.

Both the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) and the [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) can be null, which means no target element is selected. They can also both be elements in other (DOM-based) documents, or other (non-web) programs altogether. (For example, a user could drag text to a word-processor.) The [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) is initially null.

In addition, there is also a current drag operation, which can take on the values "`none`", "`copy`", "`link`", and "`move`". Initially, it has the value "`[none](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-none)`". It is updated by the user agent as described in the steps below.

User agents must, as soon as the drag operation is [initiated](https://html.spec.whatwg.org/multipage/dnd.html#initiate-the-drag-and-drop-operation) and every 350ms (±200ms) thereafter for as long as the drag operation is ongoing, [queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) to perform the following steps in sequence:

1. If the user agent is still performing the previous iteration of the sequence (if any) when the next iteration becomes due, return for this iteration (effectively "skipping missed frames" of the drag-and-drop operation).
    
2. [Fire a DND event](https://html.spec.whatwg.org/multipage/dnd.html#fire-a-dnd-event) named `[drag](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-drag)` at the [source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node). If this event is canceled, the user agent must set the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) to "`[none](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-none)`" (no drag operation).
    
3. If the `[drag](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-drag)` event was not canceled and the user has not ended the drag-and-drop operation, check the state of the drag-and-drop operation, as follows:
    
    1. If the user is indicating a different [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) than during the last iteration (or if this is the first iteration), and if this [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) is not the same as the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element), then update the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) as follows:
        
        If the new [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) is null
        
        Set the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) to null also.
        
        If the new [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) is in a non-DOM document or application
        
        Set the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) to the [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection).
        
        Otherwise
        
        [Fire a DND event](https://html.spec.whatwg.org/multipage/dnd.html#fire-a-dnd-event) named `[dragenter](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragenter)` at the [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection).
        
        If the event is canceled, then set the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) to the [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection).
        
        Otherwise, run the appropriate step from the following list:
        
        If the [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) is a text control (e.g., `[textarea](https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element)`, or an `[input](https://html.spec.whatwg.org/multipage/input.html#the-input-element)` element whose `[type](https://html.spec.whatwg.org/multipage/input.html#attr-input-type)` attribute is in the [Text](https://html.spec.whatwg.org/multipage/input.html#text-\(type=text\)-state-and-search-state-\(type=search\)) state) or an [editing host](https://html.spec.whatwg.org/multipage/interaction.html#editing-host) or [editable](https://w3c.github.io/editing/docs/execCommand/#editable) element, and the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) has an item with [the drag data item type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) "`[text/plain](https://www.rfc-editor.org/rfc/rfc2046#section-4.1.3)`" and [the drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) _text_
        
        Set the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) to the [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) anyway.
        
        If the [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) is [the body element](https://html.spec.whatwg.org/multipage/dom.html#the-body-element-2)
        
        Leave the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) unchanged.
        
        Otherwise
        
        [Fire a DND event](https://html.spec.whatwg.org/multipage/dnd.html#fire-a-dnd-event) named `[dragenter](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragenter)` at [the body element](https://html.spec.whatwg.org/multipage/dom.html#the-body-element-2), if there is one, or at the `[Document](https://html.spec.whatwg.org/multipage/dom.html#document)` object, if not. Then, set the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) to [the body element](https://html.spec.whatwg.org/multipage/dom.html#the-body-element-2), regardless of whether that event was canceled or not.
        
    2. If the previous step caused the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) to change, and if the previous target element was not null or a part of a non-DOM document, then [fire a DND event](https://html.spec.whatwg.org/multipage/dnd.html#fire-a-dnd-event) named `[dragleave](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragleave)` at the previous target element, with the new [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) as the specific _related target_.
        
    3. If the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) is a DOM element, then [fire a DND event](https://html.spec.whatwg.org/multipage/dnd.html#fire-a-dnd-event) named `[dragover](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragover)` at this [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element).
        
        If the `[dragover](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragover)` event is not canceled, run the appropriate step from the following list:
        
        If the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) is a text control (e.g., `[textarea](https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element)`, or an `[input](https://html.spec.whatwg.org/multipage/input.html#the-input-element)` element whose `[type](https://html.spec.whatwg.org/multipage/input.html#attr-input-type)` attribute is in the [Text](https://html.spec.whatwg.org/multipage/input.html#text-\(type=text\)-state-and-search-state-\(type=search\)) state) or an [editing host](https://html.spec.whatwg.org/multipage/interaction.html#editing-host) or [editable](https://w3c.github.io/editing/docs/execCommand/#editable) element, and the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) has an item with [the drag data item type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) "`[text/plain](https://www.rfc-editor.org/rfc/rfc2046#section-4.1.3)`" and [the drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) _text_
        
        Set the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) to either "`[copy](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-copy)`" or "`[move](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-move)`", as appropriate given the platform conventions.
        
        Otherwise
        
        Reset the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) to "`[none](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-none)`".
        
        Otherwise (if the `[dragover](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragover)` event _is_ canceled), set the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) based on the values of the `[effectAllowed](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed)` and `[dropEffect](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect)` attributes of the `[DragEvent](https://html.spec.whatwg.org/multipage/dnd.html#dragevent)` object's `[dataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#dom-dragevent-datatransfer)` object as they stood after the event [dispatch](https://dom.spec.whatwg.org/#concept-event-dispatch) finished, as per the following table:
        
        |`[effectAllowed](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed)`|`[dropEffect](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect)`|Drag operation|
        |---|---|---|
        |"`[uninitialized](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized)`", "`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copy)`", "`[copyLink](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copylink)`", "`[copyMove](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copymove)`", or "`[all](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-all)`"|"`[copy](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-copy)`"|"`[copy](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-copy)`"|
        |"`[uninitialized](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized)`", "`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-link)`", "`[copyLink](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copylink)`", "`[linkMove](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-linkmove)`", or "`[all](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-all)`"|"`[link](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-link)`"|"`[link](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-link)`"|
        |"`[uninitialized](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized)`", "`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-move)`", "`[copyMove](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-copymove)`", "`[linkMove](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-linkmove)`", or "`[all](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-all)`"|"`[move](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-move)`"|"`[move](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-move)`"|
        |Any other case|   |"`[none](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-none)`"|
        
    4. Otherwise, if the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) is not a DOM element, use platform-specific mechanisms to determine what drag operation is being performed (none, copy, link, or move), and set the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) accordingly.
        
    5. Update the drag feedback (e.g. the mouse cursor) to match the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation), as follows:
        
        |Drag operation|Feedback|
        |---|---|
        |"`[copy](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-copy)`"|Data will be copied if dropped here.|
        |"`[link](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-link)`"|Data will be linked if dropped here.|
        |"`[move](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-move)`"|Data will be moved if dropped here.|
        |"`[none](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-none)`"|No operation allowed, dropping here will cancel the drag-and-drop operation.|
        
4. Otherwise, if the user ended the drag-and-drop operation (e.g. by releasing the mouse button in a mouse-driven drag-and-drop interface), or if the `[drag](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-drag)` event was canceled, then this will be the last iteration. Run the following steps, then stop the drag-and-drop operation:
    
    1. If the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) is "`[none](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-none)`" (no drag operation), or if the user ended the drag-and-drop operation by canceling it (e.g. by hitting the Escape key), or if the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) is null, then the drag operation failed. Run these substeps:
        
        1. Let dropped be false.
            
        2. If the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) is a DOM element, [fire a DND event](https://html.spec.whatwg.org/multipage/dnd.html#fire-a-dnd-event) named `[dragleave](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragleave)` at it; otherwise, if it is not null, use platform-specific conventions for drag cancelation.
            
        3. Set the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) to "`[none](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-none)`".
            
        
        Otherwise, the drag operation might be a success; run these substeps:
        
        4. Let dropped be true.
            
        5. If the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) is a DOM element, [fire a DND event](https://html.spec.whatwg.org/multipage/dnd.html#fire-a-dnd-event) named `[drop](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-drop)` at it; otherwise, use platform-specific conventions for indicating a drop.
            
        6. If the event is canceled, set the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) to the value of the `[dropEffect](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect)` attribute of the `[DragEvent](https://html.spec.whatwg.org/multipage/dnd.html#dragevent)` object's `[dataTransfer](https://html.spec.whatwg.org/multipage/dnd.html#dom-dragevent-datatransfer)` object as it stood after the event [dispatch](https://dom.spec.whatwg.org/#concept-event-dispatch) finished.
            
            Otherwise, the event is not canceled; perform the event's default action, which depends on the exact target as follows:
            
            If the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) is a text control (e.g., `[textarea](https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element)`, or an `[input](https://html.spec.whatwg.org/multipage/input.html#the-input-element)` element whose `[type](https://html.spec.whatwg.org/multipage/input.html#attr-input-type)` attribute is in the [Text](https://html.spec.whatwg.org/multipage/input.html#text-\(type=text\)-state-and-search-state-\(type=search\)) state) or an [editing host](https://html.spec.whatwg.org/multipage/interaction.html#editing-host) or [editable](https://w3c.github.io/editing/docs/execCommand/#editable) element, and the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) has an item with [the drag data item type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) "`[text/plain](https://www.rfc-editor.org/rfc/rfc2046#section-4.1.3)`" and [the drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) _text_
            
            Insert the actual data of the first item in the [drag data store item list](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-item-list) to have [a drag data item type string](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-type-string) of "`[text/plain](https://www.rfc-editor.org/rfc/rfc2046#section-4.1.3)`" and [a drag data item kind](https://html.spec.whatwg.org/multipage/dnd.html#the-drag-data-item-kind) that is _text_ into the text control or [editing host](https://html.spec.whatwg.org/multipage/interaction.html#editing-host) or [editable](https://w3c.github.io/editing/docs/execCommand/#editable) element in a manner consistent with platform-specific conventions (e.g. inserting it at the current mouse cursor position, or inserting it at the end of the field).
            
            Otherwise
            
            Reset the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) to "`[none](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-none)`".
            
    2. [Fire a DND event](https://html.spec.whatwg.org/multipage/dnd.html#fire-a-dnd-event) named `[dragend](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragend)` at the [source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node).
        
    3. Run the appropriate steps from the following list as the default action of the `[dragend](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragend)` event:
        
        If dropped is true, the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) is a _text control_ (see below), the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) is "`[move](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-move)`", and the source of the drag-and-drop operation is a selection in the DOM that is entirely contained within an [editing host](https://html.spec.whatwg.org/multipage/interaction.html#editing-host)
        
        [Delete the selection](https://w3c.github.io/editing/docs/execCommand/#delete-the-selection).
        
        If dropped is true, the [current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element) is a _text control_ (see below), the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) is "`[move](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-move)`", and the source of the drag-and-drop operation is a selection in a text control
        
        The user agent should delete the dragged selection from the relevant text control.
        
        If dropped is false or if the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) is "`[none](https://html.spec.whatwg.org/multipage/dnd.html#concept-current-drag-operation-none)`"
        
        The drag was canceled. If the platform conventions dictate that this be represented to the user (e.g. by animating the dragged selection going back to the source of the drag-and-drop operation), then do so.
        
        Otherwise
        
        The event has no default action.
        
        For the purposes of this step, a _text control_ is a `[textarea](https://html.spec.whatwg.org/multipage/form-elements.html#the-textarea-element)` element or an `[input](https://html.spec.whatwg.org/multipage/input.html#the-input-element)` element whose `[type](https://html.spec.whatwg.org/multipage/input.html#attr-input-type)` attribute is in one of the [Text](https://html.spec.whatwg.org/multipage/input.html#text-\(type=text\)-state-and-search-state-\(type=search\)), [Search](https://html.spec.whatwg.org/multipage/input.html#text-\(type=text\)-state-and-search-state-\(type=search\)), [Tel](https://html.spec.whatwg.org/multipage/input.html#telephone-state-\(type=tel\)), [URL](https://html.spec.whatwg.org/multipage/input.html#url-state-\(type=url\)), [Email](https://html.spec.whatwg.org/multipage/input.html#email-state-\(type=email\)), [Password](https://html.spec.whatwg.org/multipage/input.html#password-state-\(type=password\)), or [Number](https://html.spec.whatwg.org/multipage/input.html#number-state-\(type=number\)) states.
        

User agents are encouraged to consider how to react to drags near the edge of scrollable regions. For example, if a user drags a link to the bottom of the [viewport](https://drafts.csswg.org/css2/#viewport) on a long page, it might make sense to scroll the page so that the user can drop the link lower on the page.

This model is independent of which `[Document](https://html.spec.whatwg.org/multipage/dom.html#document)` object the nodes involved are from; the events are fired as described above and the rest of the processing model runs as described above, irrespective of how many documents are involved in the operation.

#### 6.11.6 Events summary[](https://html.spec.whatwg.org/multipage/dnd.html#dndevents)

_This section is non-normative._

The following events are involved in the drag-and-drop model.

|Event name|Target|Cancelable?|[Drag data store mode](https://html.spec.whatwg.org/multipage/dnd.html#drag-data-store-mode)|`[dropEffect](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect)`|Default Action|
|---|---|---|---|---|---|
|`dragstart`<br><br>**✔**MDN|[Source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node)|✓ Cancelable|[Read/write mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-rw)|"`[none](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-none)`"|Initiate the drag-and-drop operation|
|`drag`<br><br>**✔**MDN|[Source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node)|✓ Cancelable|[Protected mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p)|"`[none](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-none)`"|Continue the drag-and-drop operation|
|`dragenter`<br><br>**✔**MDN|[Immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) or [the body element](https://html.spec.whatwg.org/multipage/dom.html#the-body-element-2)|✓ Cancelable|[Protected mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p)|[Based on `effectAllowed` value](https://html.spec.whatwg.org/multipage/dnd.html#dropEffect-initialisation)|Reject [immediate user selection](https://html.spec.whatwg.org/multipage/dnd.html#immediate-user-selection) as potential [target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element)|
|`dragleave`<br><br>**✔**MDN|[Previous target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element)|—|[Protected mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p)|"`[none](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-dropeffect-none)`"|None|
|`dragover`<br><br>**✔**MDN|[Current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element)|✓ Cancelable|[Protected mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p)|[Based on `effectAllowed` value](https://html.spec.whatwg.org/multipage/dnd.html#dropEffect-initialisation)|Reset the [current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation) to "none"|
|`drop`<br><br>**✔**MDN|[Current target element](https://html.spec.whatwg.org/multipage/dnd.html#current-target-element)|✓ Cancelable|[Read-only mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-ro)|[Current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation)|Varies|
|`dragend`<br><br>**✔**MDN|[Source node](https://html.spec.whatwg.org/multipage/dnd.html#source-node)|—|[Protected mode](https://html.spec.whatwg.org/multipage/dnd.html#concept-dnd-p)|[Current drag operation](https://html.spec.whatwg.org/multipage/dnd.html#current-drag-operation)|Varies|

All of these events bubble, are composed, and the `[effectAllowed](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed)` attribute always has the value it had after the `[dragstart](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragstart)` event, defaulting to "`[uninitialized](https://html.spec.whatwg.org/multipage/dnd.html#dom-datatransfer-effectallowed-uninitialized)`" in the `[dragstart](https://html.spec.whatwg.org/multipage/dnd.html#event-dnd-dragstart)` event.

#### 6.11.7 The `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable)` attribute[](https://html.spec.whatwg.org/multipage/dnd.html#the-draggable-attribute)

**✔**MDN

All [HTML elements](https://html.spec.whatwg.org/multipage/infrastructure.html#html-elements) may have the `draggable` content attribute set. The `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable)` attribute is an [enumerated attribute](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#enumerated-attribute) with the following keywords and states:

|Keyword|State|Brief description|
|---|---|---|
|`true`|True|The element will be draggable.|
|`false`|False|The element will not be draggable.|

The attribute's _[missing value default](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#missing-value-default)_ and _[invalid value default](https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#invalid-value-default)_ are both the Auto state. The auto state uses the default behavior of the user agent.

An element with a `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable)` attribute should also have a `[title](https://html.spec.whatwg.org/multipage/dom.html#attr-title)` attribute that names the element for the purpose of non-visual interactions.

`element.[draggable](https://html.spec.whatwg.org/multipage/dnd.html#dom-draggable) [ = value ]`

Returns true if the element is draggable; otherwise, returns false.

Can be set, to override the default and set the `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable)` content attribute.

The `draggable` IDL attribute, whose value depends on the content attribute's in the way described below, controls whether or not the element is draggable. Generally, only text selections are draggable, but elements whose `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#dom-draggable)` IDL attribute is true become draggable as well.

If an element's `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable)` content attribute has the state [True](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable-true-state), the `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#dom-draggable)` IDL attribute must return true.

Otherwise, if the element's `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable)` content attribute has the state [False](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable-false-state), the `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#dom-draggable)` IDL attribute must return false.

Otherwise, the element's `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable)` content attribute has the state [Auto](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable-auto-state). If the element is an `[img](https://html.spec.whatwg.org/multipage/embedded-content.html#the-img-element)` element, an `[object](https://html.spec.whatwg.org/multipage/iframe-embed-object.html#the-object-element)` element that [represents](https://html.spec.whatwg.org/multipage/dom.html#represents) an image, or an `[a](https://html.spec.whatwg.org/multipage/text-level-semantics.html#the-a-element)` element with an `[href](https://html.spec.whatwg.org/multipage/links.html#attr-hyperlink-href)` content attribute, the `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#dom-draggable)` IDL attribute must return true; otherwise, the `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#dom-draggable)` IDL attribute must return false.

If the `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#dom-draggable)` IDL attribute is set to the value false, the `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable)` content attribute must be set to the literal value "`false`". If the `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#dom-draggable)` IDL attribute is set to the value true, the `[draggable](https://html.spec.whatwg.org/multipage/dnd.html#attr-draggable)` content attribute must be set to the literal value "`true`".


---


#### 9.2.3 Processing model[](https://html.spec.whatwg.org/multipage/server-sent-events.html#sse-processing-model)

When a user agent is to announce the connection, the user agent must [queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) which, if the `[readyState](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-readystate)` attribute is set to a value other than `[CLOSED](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-closed)`, sets the `[readyState](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-readystate)` attribute to `[OPEN](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-open)` and [fires an event](https://dom.spec.whatwg.org/#concept-event-fire) named `[open](https://html.spec.whatwg.org/multipage/indices.html#event-open)` at the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object.

When a user agent is to reestablish the connection, the user agent must run the following steps. These steps are run [in parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel), not as part of a [task](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task). (The tasks that it queues, of course, are run like normal tasks and not themselves [in parallel](https://html.spec.whatwg.org/multipage/infrastructure.html#in-parallel).)

1. [Queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) to run the following steps:
    
    1. If the `[readyState](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-readystate)` attribute is set to `[CLOSED](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-closed)`, abort the task.
        
    2. Set the `[readyState](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-readystate)` attribute to `[CONNECTING](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-connecting)`.
        
    3. [Fire an event](https://dom.spec.whatwg.org/#concept-event-fire) named `[error](https://html.spec.whatwg.org/multipage/indices.html#event-error)` at the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object.
        
2. Wait a delay equal to the reconnection time of the event source.
    
3. Optionally, wait some more. In particular, if the previous attempt failed, then user agents might introduce an exponential backoff delay to avoid overloading a potentially already overloaded server. Alternatively, if the operating system has reported that there is no network connectivity, user agents might wait for the operating system to announce that the network connection has returned before retrying.
    
4. Wait until the aforementioned task has run, if it has not yet run.
    
5. [Queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) to run the following steps:
    
    1. If the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object's `[readyState](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-readystate)` attribute is not set to `[CONNECTING](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-connecting)`, then return.
        
    2. Let request be the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object's [request](https://html.spec.whatwg.org/multipage/server-sent-events.html#concept-event-stream-request).
        
    3. If the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object's [last event ID string](https://html.spec.whatwg.org/multipage/server-sent-events.html#concept-event-stream-last-event-id) is not the empty string, then:
        
        1. Let lastEventIDValue be the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object's [last event ID string](https://html.spec.whatwg.org/multipage/server-sent-events.html#concept-event-stream-last-event-id), [encoded as UTF-8](https://encoding.spec.whatwg.org/#utf-8-encode).
            
        2. [Set](https://fetch.spec.whatwg.org/#concept-header-list-set) (``[Last-Event-ID](https://html.spec.whatwg.org/multipage/server-sent-events.html#last-event-id)``, lastEventIDValue) in request's [header list](https://fetch.spec.whatwg.org/#concept-request-header-list).
            
    4. [Fetch](https://fetch.spec.whatwg.org/#concept-fetch) request and process the response obtained in this fashion, if any, as described earlier in this section.
        

When a user agent is to fail the connection, the user agent must [queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) which, if the `[readyState](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-readystate)` attribute is set to a value other than `[CLOSED](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-closed)`, sets the `[readyState](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-readystate)` attribute to `[CLOSED](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-closed)` and [fires an event](https://dom.spec.whatwg.org/#concept-event-fire) named `[error](https://html.spec.whatwg.org/multipage/indices.html#event-error)` at the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object. **Once the user agent has [failed the connection](https://html.spec.whatwg.org/multipage/server-sent-events.html#fail-the-connection), it does _not_ attempt to reconnect.**

---

The [task source](https://html.spec.whatwg.org/multipage/webappapis.html#task-source) for any [tasks](https://html.spec.whatwg.org/multipage/webappapis.html#concept-task) that are [queued](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) by `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` objects is the remote event task source.

#### 9.2.4 The ``[Last-Event-ID](https://html.spec.whatwg.org/multipage/server-sent-events.html#last-event-id)`` header[](https://html.spec.whatwg.org/multipage/server-sent-events.html#the-last-event-id-header)

The `Last-Event-ID`` HTTP request header reports an `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object's [last event ID string](https://html.spec.whatwg.org/multipage/server-sent-events.html#concept-event-stream-last-event-id) to the server when the user agent is to [reestablish the connection](https://html.spec.whatwg.org/multipage/server-sent-events.html#reestablish-the-connection).

See [whatwg/html issue #7363](https://github.com/whatwg/html/issues/7363) to define the value space better. It is essentially any UTF-8 encoded string, that does not contain U+0000 NULL, U+000A LF, or U+000D CR.

#### 9.2.5 Parsing an event stream[](https://html.spec.whatwg.org/multipage/server-sent-events.html#parsing-an-event-stream)

This event stream format's [MIME type](https://mimesniff.spec.whatwg.org/#mime-type) is `[text/event-stream](https://html.spec.whatwg.org/multipage/iana.html#text/event-stream)`.

The event stream format is as described by the `stream` production of the following ABNF, the character set for which is Unicode. [[ABNF]](https://html.spec.whatwg.org/multipage/references.html#refsABNF)

```
stream        = [ bom ] *event
event         = *( comment / field ) end-of-line
comment       = colon *any-char end-of-line
field         = 1*name-char [ colon [ space ] *any-char ] end-of-line
end-of-line   = ( cr lf / cr / lf )

; characters
lf            = %x000A ; U+000A LINE FEED (LF)
cr            = %x000D ; U+000D CARRIAGE RETURN (CR)
space         = %x0020 ; U+0020 SPACE
colon         = %x003A ; U+003A COLON (:)
bom           = %xFEFF ; U+FEFF BYTE ORDER MARK
name-char     = %x0000-0009 / %x000B-000C / %x000E-0039 / %x003B-10FFFF
                ; a scalar value other than U+000A LINE FEED (LF), U+000D CARRIAGE RETURN (CR), or U+003A COLON (:)
any-char      = %x0000-0009 / %x000B-000C / %x000E-10FFFF
                ; a scalar value other than U+000A LINE FEED (LF) or U+000D CARRIAGE RETURN (CR)
```

Event streams in this format must always be encoded as UTF-8. [[ENCODING]](https://html.spec.whatwg.org/multipage/references.html#refsENCODING)

Lines must be separated by either a U+000D CARRIAGE RETURN U+000A LINE FEED (CRLF) character pair, a single U+000A LINE FEED (LF) character, or a single U+000D CARRIAGE RETURN (CR) character.

Since connections established to remote servers for such resources are expected to be long-lived, UAs should ensure that appropriate buffering is used. In particular, while line buffering with lines are defined to end with a single U+000A LINE FEED (LF) character is safe, block buffering or line buffering with different expected line endings can cause delays in event dispatch.

#### 9.2.6 Interpreting an event stream[](https://html.spec.whatwg.org/multipage/server-sent-events.html#event-stream-interpretation)

Streams must be decoded using the [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode) algorithm.

The [UTF-8 decode](https://encoding.spec.whatwg.org/#utf-8-decode) algorithm strips one leading UTF-8 Byte Order Mark (BOM), if any.

The stream must then be parsed by reading everything line by line, with a U+000D CARRIAGE RETURN U+000A LINE FEED (CRLF) character pair, a single U+000A LINE FEED (LF) character not preceded by a U+000D CARRIAGE RETURN (CR) character, and a single U+000D CARRIAGE RETURN (CR) character not followed by a U+000A LINE FEED (LF) character being the ways in which a line can end.

When a stream is parsed, a data buffer, an event type buffer, and a last event ID buffer must be associated with it. They must be initialized to the empty string.

Lines must be processed, in the order they are received, as follows:

If the line is empty (a blank line)

[Dispatch the event](https://html.spec.whatwg.org/multipage/server-sent-events.html#dispatchMessage), as defined below.

If the line starts with a U+003A COLON character (:)

Ignore the line.

If the line contains a U+003A COLON character (:)

Collect the characters on the line before the first U+003A COLON character (:), and let field be that string.

Collect the characters on the line after the first U+003A COLON character (:), and let value be that string. If value starts with a U+0020 SPACE character, remove it from value.

[Process the field](https://html.spec.whatwg.org/multipage/server-sent-events.html#processField) using the steps described below, using field as the field name and value as the field value.

Otherwise, the string is not empty but does not contain a U+003A COLON character (:)

[Process the field](https://html.spec.whatwg.org/multipage/server-sent-events.html#processField) using the steps described below, using the whole line as the field name, and the empty string as the field value.

Once the end of the file is reached, any pending data must be discarded. (If the file ends in the middle of an event, before the final empty line, the incomplete event is not dispatched.)

---

The steps to process the field given a field name and a field value depend on the field name, as given in the following list. Field names must be compared literally, with no case folding performed.

If the field name is "event"

Set the event type buffer to the field value.

If the field name is "data"

Append the field value to the data buffer, then append a single U+000A LINE FEED (LF) character to the data buffer.

If the field name is "id"

If the field value does not contain U+0000 NULL, then set the last event ID buffer to the field value. Otherwise, ignore the field.

If the field name is "retry"

If the field value consists of only [ASCII digits](https://infra.spec.whatwg.org/#ascii-digit), then interpret the field value as an integer in base ten, and set the event stream's [reconnection time](https://html.spec.whatwg.org/multipage/server-sent-events.html#concept-event-stream-reconnection-time) to that integer. Otherwise, ignore the field.

Otherwise

The field is ignored.

When the user agent is required to dispatch the event, the user agent must process the data buffer, the event type buffer, and the last event ID buffer using steps appropriate for the user agent.

For web browsers, the appropriate steps to [dispatch the event](https://html.spec.whatwg.org/multipage/server-sent-events.html#dispatchMessage) are as follows:

1. Set the [last event ID string](https://html.spec.whatwg.org/multipage/server-sent-events.html#concept-event-stream-last-event-id) of the event source to the value of the last event ID buffer. The buffer does not get reset, so the [last event ID string](https://html.spec.whatwg.org/multipage/server-sent-events.html#concept-event-stream-last-event-id) of the event source remains set to this value until the next time it is set by the server.
    
2. If the data buffer is an empty string, set the data buffer and the event type buffer to the empty string and return.
    
3. If the data buffer's last character is a U+000A LINE FEED (LF) character, then remove the last character from the data buffer.
    
4. Let event be the result of [creating an event](https://dom.spec.whatwg.org/#concept-event-create) using `[MessageEvent](https://html.spec.whatwg.org/multipage/comms.html#messageevent)`, in the [relevant realm](https://html.spec.whatwg.org/multipage/webappapis.html#concept-relevant-realm) of the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object.
    
5. Initialize event's `[type](https://dom.spec.whatwg.org/#dom-event-type)` attribute to "`[message](https://html.spec.whatwg.org/multipage/indices.html#event-message)`", its `[data](https://html.spec.whatwg.org/multipage/comms.html#dom-messageevent-data)` attribute to data, its [origin](https://html.spec.whatwg.org/multipage/comms.html#concept-messageevent-origin) to the [origin](https://url.spec.whatwg.org/#concept-url-origin) of the event stream's final URL (i.e., the URL after redirects), and its `[lastEventId](https://html.spec.whatwg.org/multipage/comms.html#dom-messageevent-lasteventid)` attribute to the [last event ID string](https://html.spec.whatwg.org/multipage/server-sent-events.html#concept-event-stream-last-event-id) of the event source.
    
6. If the event type buffer has a value other than the empty string, change the [type](https://dom.spec.whatwg.org/#dom-event-type) of the newly created event to equal the value of the event type buffer.
    
7. Set the data buffer and the event type buffer to the empty string.
    
8. [Queue a task](https://html.spec.whatwg.org/multipage/webappapis.html#queue-a-task) which, if the `[readyState](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-readystate)` attribute is set to a value other than `[CLOSED](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-closed)`, [dispatches](https://dom.spec.whatwg.org/#concept-event-dispatch) the newly created event at the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object.
    

If an event doesn't have an "id" field, but an earlier event did set the event source's [last event ID string](https://html.spec.whatwg.org/multipage/server-sent-events.html#concept-event-stream-last-event-id), then the event's `[lastEventId](https://html.spec.whatwg.org/multipage/comms.html#dom-messageevent-lasteventid)` field will be set to the value of whatever the last seen "id" field was.

For other user agents, the appropriate steps to [dispatch the event](https://html.spec.whatwg.org/multipage/server-sent-events.html#dispatchMessage) are implementation dependent, but at a minimum they must set the data and event type buffers to the empty string before returning.

The following event stream, once followed by a blank line:

data: YHOO
data: +2
data: 10

...would cause an event `[message](https://html.spec.whatwg.org/multipage/indices.html#event-message)` with the interface `[MessageEvent](https://html.spec.whatwg.org/multipage/comms.html#messageevent)` to be dispatched on the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object. The event's `[data](https://html.spec.whatwg.org/multipage/comms.html#dom-messageevent-data)` attribute would contain the string "`YHOO\n+2\n10`" (where "`\n`" represents a newline).

This could be used as follows:

```
var stocks = new EventSource("https://stocks.example.com/ticker.php");
stocks.onmessage = function (event) {
  var data = event.data.split('\n');
  updateStocks(data[0], data[1], data[2]);
};
```

...where `updateStocks()` is a function defined as:

```
function updateStocks(symbol, delta, value) { ... }
```

...or some such.

The following stream contains four blocks. The first block has just a comment, and will fire nothing. The second block has two fields with names "data" and "id" respectively; an event will be fired for this block, with the data "first event", and will then set the last event ID to "1" so that if the connection died between this block and the next, the server would be sent a ``[Last-Event-ID](https://html.spec.whatwg.org/multipage/server-sent-events.html#last-event-id)`` header with the value ``1``. The third block fires an event with data "second event", and also has an "id" field, this time with no value, which resets the last event ID to the empty string (meaning no ``[Last-Event-ID](https://html.spec.whatwg.org/multipage/server-sent-events.html#last-event-id)`` header will now be sent in the event of a reconnection being attempted). Finally, the last block just fires an event with the data " third event" (with a single leading space character). Note that the last still has to end with a blank line, the end of the stream is not enough to trigger the dispatch of the last event.

: test stream

data: first event
id: 1

data:second event
id

data:  third event

The following stream fires two events:

data

data
data

data:

The first block fires events with the data set to the empty string, as would the last block if it was followed by a blank line. The middle block fires an event with the data set to a single newline character. The last block is discarded because it is not followed by a blank line.

The following stream fires two identical events:

data:test

data: test

This is because the space after the colon is ignored if present.

#### 9.2.7 Authoring notes[](https://html.spec.whatwg.org/multipage/server-sent-events.html#authoring-notes)

Legacy proxy servers are known to, in certain cases, drop HTTP connections after a short timeout. To protect against such proxy servers, authors can include a comment line (one starting with a ':' character) every 15 seconds or so.

Authors wishing to relate event source connections to each other or to specific documents previously served might find that relying on IP addresses doesn't work, as individual clients can have multiple IP addresses (due to having multiple proxy servers) and individual IP addresses can have multiple clients (due to sharing a proxy server). It is better to include a unique identifier in the document when it is served and then pass that identifier as part of the URL when the connection is established.

Authors are also cautioned that HTTP chunking can have unexpected negative effects on the reliability of this protocol, in particular if the chunking is done by a different layer unaware of the timing requirements. If this is a problem, chunking can be disabled for serving event streams.

Clients that support HTTP's per-server connection limitation might run into trouble when opening multiple pages from a site if each page has an `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` to the same domain. Authors can avoid this using the relatively complex mechanism of using unique domain names per connection, or by allowing the user to enable or disable the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` functionality on a per-page basis, or by sharing a single `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object using a [shared worker](https://html.spec.whatwg.org/multipage/workers.html#sharedworkerglobalscope).

#### 9.2.8 Connectionless push and other features[](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource-push)

User agents running in controlled environments, e.g. browsers on mobile handsets tied to specific carriers, may offload the management of the connection to a proxy on the network. In such a situation, the user agent for the purposes of conformance is considered to include both the handset software and the network proxy.

For example, a browser on a mobile device, after having established a connection, might detect that it is on a supporting network and request that a proxy server on the network take over the management of the connection. The timeline for such a situation might be as follows:

1. Browser connects to a remote HTTP server and requests the resource specified by the author in the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource)` constructor.
2. The server sends occasional messages.
3. In between two messages, the browser detects that it is idle except for the network activity involved in keeping the TCP connection alive, and decides to switch to sleep mode to save power.
4. The browser disconnects from the server.
5. The browser contacts a service on the network, and requests that the service, a "push proxy", maintain the connection instead.
6. The "push proxy" service contacts the remote HTTP server and requests the resource specified by the author in the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource)` constructor (possibly including a ``[Last-Event-ID](https://html.spec.whatwg.org/multipage/server-sent-events.html#last-event-id)`` HTTP header, etc.).
7. The browser allows the mobile device to go to sleep.
8. The server sends another message.
9. The "push proxy" service uses a technology such as OMA push to convey the event to the mobile device, which wakes only enough to process the event and then returns to sleep.

This can reduce the total data usage, and can therefore result in considerable power savings.

As well as implementing the existing API and `[text/event-stream](https://html.spec.whatwg.org/multipage/iana.html#text/event-stream)` wire format as defined by this specification and in more distributed ways as described above, formats of event framing defined by [other applicable specifications](https://html.spec.whatwg.org/multipage/infrastructure.html#other-applicable-specifications) may be supported. This specification does not define how they are to be parsed or processed.

#### 9.2.9 Garbage collection[](https://html.spec.whatwg.org/multipage/server-sent-events.html#garbage-collection)

While an `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object's `[readyState](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-readystate)` is `[CONNECTING](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-connecting)`, and the object has one or more event listeners registered for `[open](https://html.spec.whatwg.org/multipage/indices.html#event-open)`, `[message](https://html.spec.whatwg.org/multipage/indices.html#event-message)`, or `[error](https://html.spec.whatwg.org/multipage/indices.html#event-error)` events, there must be a strong reference from the `[Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)` or `[WorkerGlobalScope](https://html.spec.whatwg.org/multipage/workers.html#workerglobalscope)` object that the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object's constructor was invoked from to the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object itself.

While an `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object's `[readyState](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-readystate)` is `[OPEN](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-open)`, and the object has one or more event listeners registered for `[message](https://html.spec.whatwg.org/multipage/indices.html#event-message)` or `[error](https://html.spec.whatwg.org/multipage/indices.html#event-error)` events, there must be a strong reference from the `[Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)` or `[WorkerGlobalScope](https://html.spec.whatwg.org/multipage/workers.html#workerglobalscope)` object that the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object's constructor was invoked from to the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object itself.

While there is a task queued by an `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object on the [remote event task source](https://html.spec.whatwg.org/multipage/server-sent-events.html#remote-event-task-source), there must be a strong reference from the `[Window](https://html.spec.whatwg.org/multipage/nav-history-apis.html#window)` or `[WorkerGlobalScope](https://html.spec.whatwg.org/multipage/workers.html#workerglobalscope)` object that the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object's constructor was invoked from to that `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object.

If a user agent is to forcibly close an `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object (this happens when a `[Document](https://html.spec.whatwg.org/multipage/dom.html#document)` object goes away permanently), the user agent must abort any instances of the [fetch](https://fetch.spec.whatwg.org/#concept-fetch) algorithm started for this `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object, and must set the `[readyState](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-readystate)` attribute to `[CLOSED](https://html.spec.whatwg.org/multipage/server-sent-events.html#dom-eventsource-closed)`.

If an `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` object is garbage collected while its connection is still open, the user agent must abort any instance of the [fetch](https://fetch.spec.whatwg.org/#concept-fetch) algorithm opened by this `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)`.

#### 9.2.10 Implementation advice[](https://html.spec.whatwg.org/multipage/server-sent-events.html#implementation-advice)

_This section is non-normative._

User agents are strongly urged to provide detailed diagnostic information about `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` objects and their related network connections in their development consoles, to aid authors in debugging code using this API.

For example, a user agent could have a panel displaying all the `[EventSource](https://html.spec.whatwg.org/multipage/server-sent-events.html#eventsource)` objects a page has created, each listing the constructor's arguments, whether there was a network error, what the CORS status of the connection is and what headers were sent by the client and received from the server to lead to that status, the messages that were received and how they were parsed, and so forth.

Implementations are especially encouraged to report detailed information to their development consoles whenever an `[error](https://html.spec.whatwg.org/multipage/indices.html#event-error)` event is fired, since little to no information can be made available in the events themselves.


---



